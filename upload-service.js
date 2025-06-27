/**
 * 腾讯云COS视频上传服务
 * 支持大文件分片上传、断点续传、进度监控
 */

class TencentCOSUploadService {
    constructor(config) {
        this.config = {
            SecretId: config.SecretId,
            SecretKey: config.SecretKey,
            Bucket: config.Bucket || 'yijianchu-videos-1234567890',
            Region: config.Region || 'ap-beijing',
            uploadPath: config.uploadPath || 'videos/',
            maxFileSize: config.maxFileSize || 500 * 1024 * 1024, // 500MB
            allowedTypes: config.allowedTypes || ['mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv'],
            chunkSize: config.chunkSize || 1024 * 1024, // 1MB 分片大小
        };

        // 初始化腾讯云COS SDK
        this.cos = new COS({
            SecretId: this.config.SecretId,
            SecretKey: this.config.SecretKey,
            FileParallelLimit: 3,    // 控制文件上传并发数
            ChunkParallelLimit: 3,   // 控制单个文件下分片上传并发数
            ChunkSize: this.config.chunkSize, // 控制分片大小
            SliceSize: this.config.chunkSize, // 使用分片上传的文件大小阈值
            onProgress: (progressData) => {
                this.onProgress && this.onProgress(progressData);
            },
            onFileFinish: (err, data, options) => {
                this.onFileFinish && this.onFileFinish(err, data, options);
            },
        });

        this.uploadTasks = new Map(); // 存储上传任务
        this.uploadQueue = []; // 上传队列
        this.isUploading = false;
    }

    /**
     * 验证文件
     */
    validateFile(file) {
        const errors = [];

        // 检查文件大小
        if (file.size > this.config.maxFileSize) {
            errors.push(`文件大小超过限制，最大支持 ${this.formatFileSize(this.config.maxFileSize)}`);
        }

        // 检查文件类型
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!this.config.allowedTypes.includes(fileExtension)) {
            errors.push(`不支持的文件格式，支持格式：${this.config.allowedTypes.join(', ')}`);
        }

        // 检查文件名
        if (file.name.length > 100) {
            errors.push('文件名过长，请控制在100字符以内');
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * 生成唯一文件名
     */
    generateFileName(originalName) {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substr(2, 9);
        const extension = originalName.split('.').pop();
        return `${timestamp}_${randomStr}.${extension}`;
    }

    /**
     * 获取文件信息
     */
    getFileInfo(file) {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve({
                    duration: video.duration,
                    width: video.videoWidth,
                    height: video.videoHeight
                });
            };

            video.onerror = () => {
                resolve({
                    duration: 0,
                    width: 0,
                    height: 0
                });
            };

            video.src = URL.createObjectURL(file);
        });
    }

    /**
     * 上传单个文件
     */
    async uploadFile(file, options = {}) {
        // 验证文件
        const validation = this.validateFile(file);
        if (!validation.valid) {
            throw new Error(validation.errors.join('; '));
        }

        // 生成文件名和Key
        const fileName = this.generateFileName(file.name);
        const key = `${this.config.uploadPath}${fileName}`;
        
        // 获取文件信息
        const fileInfo = await this.getFileInfo(file);

        // 创建上传任务
        const taskId = this.generateTaskId();
        const task = {
            id: taskId,
            file: file,
            key: key,
            fileName: fileName,
            originalName: file.name,
            size: file.size,
            fileInfo: fileInfo,
            status: 'pending', // pending, uploading, success, error, paused
            progress: 0,
            speed: 0,
            timeRemaining: 0,
            uploadedBytes: 0,
            error: null,
            startTime: Date.now(),
            options: options
        };

        this.uploadTasks.set(taskId, task);

        // 添加到上传队列
        this.uploadQueue.push(taskId);

        // 开始上传
        this.processUploadQueue();

        return taskId;
    }

    /**
     * 处理上传队列
     */
    async processUploadQueue() {
        if (this.isUploading || this.uploadQueue.length === 0) {
            return;
        }

        this.isUploading = true;

        while (this.uploadQueue.length > 0) {
            const taskId = this.uploadQueue.shift();
            const task = this.uploadTasks.get(taskId);

            if (task && task.status === 'pending') {
                await this.performUpload(task);
            }
        }

        this.isUploading = false;
    }

    /**
     * 执行上传
     */
    performUpload(task) {
        return new Promise((resolve, reject) => {
            task.status = 'uploading';
            task.startTime = Date.now();

            // 触发上传开始事件
            this.onUploadStart && this.onUploadStart(task);

            // 执行上传
            this.cos.uploadFile({
                Bucket: this.config.Bucket,
                Region: this.config.Region,
                Key: task.key,
                Body: task.file,
                SliceSize: this.config.chunkSize,
                onProgress: (progressData) => {
                    this.updateProgress(task, progressData);
                }
            }, (err, data) => {
                if (err) {
                    task.status = 'error';
                    task.error = err.message || '上传失败';
                    this.onUploadError && this.onUploadError(task, err);
                    reject(err);
                } else {
                    task.status = 'success';
                    task.progress = 100;
                    task.uploadedBytes = task.size;
                    task.cosData = data;
                    task.url = `https://${this.config.Bucket}.cos.${this.config.Region}.myqcloud.com/${task.key}`;
                    
                    this.onUploadSuccess && this.onUploadSuccess(task, data);
                    resolve(data);
                }
            });
        });
    }

    /**
     * 更新上传进度
     */
    updateProgress(task, progressData) {
        const now = Date.now();
        const timeElapsed = (now - task.startTime) / 1000; // 秒
        
        task.progress = Math.round(progressData.percent * 100);
        task.uploadedBytes = progressData.loaded;
        
        // 计算上传速度
        if (timeElapsed > 0) {
            task.speed = progressData.loaded / timeElapsed; // bytes/second
            
            // 计算剩余时间
            const remainingBytes = task.size - progressData.loaded;
            task.timeRemaining = remainingBytes / task.speed; // 秒
        }

        // 触发进度更新事件
        this.onUploadProgress && this.onUploadProgress(task, progressData);
    }

    /**
     * 暂停上传
     */
    pauseUpload(taskId) {
        const task = this.uploadTasks.get(taskId);
        if (task && task.status === 'uploading') {
            // 腾讯云COS SDK暂不支持暂停，这里标记状态
            task.status = 'paused';
            this.onUploadPaused && this.onUploadPaused(task);
        }
    }

    /**
     * 恢复上传
     */
    resumeUpload(taskId) {
        const task = this.uploadTasks.get(taskId);
        if (task && task.status === 'paused') {
            task.status = 'pending';
            this.uploadQueue.unshift(taskId); // 添加到队列前面
            this.processUploadQueue();
        }
    }

    /**
     * 取消上传
     */
    cancelUpload(taskId) {
        const task = this.uploadTasks.get(taskId);
        if (task) {
            task.status = 'cancelled';
            this.uploadTasks.delete(taskId);
            
            // 从队列中移除
            const queueIndex = this.uploadQueue.indexOf(taskId);
            if (queueIndex > -1) {
                this.uploadQueue.splice(queueIndex, 1);
            }

            this.onUploadCancelled && this.onUploadCancelled(task);
        }
    }

    /**
     * 获取上传任务
     */
    getTask(taskId) {
        return this.uploadTasks.get(taskId);
    }

    /**
     * 获取所有上传任务
     */
    getAllTasks() {
        return Array.from(this.uploadTasks.values());
    }

    /**
     * 批量上传文件
     */
    async uploadFiles(files, options = {}) {
        const taskIds = [];
        for (const file of files) {
            try {
                const taskId = await this.uploadFile(file, options);
                taskIds.push(taskId);
            } catch (error) {
                console.error('批量上传文件失败:', error);
            }
        }
        return taskIds;
    }

    /**
     * 删除云端文件
     */
    deleteFile(key) {
        return new Promise((resolve, reject) => {
            this.cos.deleteObject({
                Bucket: this.config.Bucket,
                Region: this.config.Region,
                Key: key
            }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    /**
     * 获取文件访问URL
     */
    getFileUrl(key, expires = 3600) {
        return this.cos.getObjectUrl({
            Bucket: this.config.Bucket,
            Region: this.config.Region,
            Key: key,
            Expires: expires,
            Sign: true
        });
    }

    /**
     * 生成任务ID
     */
    generateTaskId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 格式化文件大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 格式化时间
     */
    formatTime(seconds) {
        if (!seconds || seconds === Infinity) return '--';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    /**
     * 格式化上传速度
     */
    formatSpeed(bytesPerSecond) {
        if (!bytesPerSecond) return '0 B/s';
        return this.formatFileSize(bytesPerSecond) + '/s';
    }

    // 事件回调（可在外部设置）
    onUploadStart = null;
    onUploadProgress = null;
    onUploadSuccess = null;
    onUploadError = null;
    onUploadPaused = null;
    onUploadCancelled = null;
}

// 导出服务类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TencentCOSUploadService;
} else {
    window.TencentCOSUploadService = TencentCOSUploadService;
} 