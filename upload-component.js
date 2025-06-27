/**
 * 视频上传组件
 * 提供完整的UI界面和交互功能
 */

class VideoUploadComponent {
    constructor(container, uploadService, options = {}) {
        this.container = typeof container === 'string' ? document.getElementById(container) : container;
        this.uploadService = uploadService;
        this.options = {
            multiple: true,
            showPreview: true,
            showQueue: true,
            autoStart: true,
            theme: 'dark',
            ...options
        };

        this.uploadTasks = new Map();
        this.init();
        this.bindEvents();
    }

    init() {
        this.createHTML();
        this.setupUploadService();
    }

    createHTML() {
        this.container.innerHTML = `
            <div class="video-upload-component ${this.options.theme}">
                <!-- 上传区域 -->
                <div class="upload-zone" id="uploadZone">
                    <div class="upload-area" id="uploadArea">
                        <div class="upload-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </div>
                        <div class="upload-text">
                            <h3>拖拽视频文件到此处</h3>
                            <p>或点击选择文件</p>
                            <div class="upload-info">
                                支持 MP4, AVI, MOV, MKV 格式，最大 500MB
                            </div>
                        </div>
                        <button class="upload-btn" id="selectFileBtn">
                            <i class="fas fa-folder-open mr-2"></i>选择文件
                        </button>
                        <input type="file" id="fileInput" multiple accept="video/*" style="display: none;">
                    </div>
                </div>

                <!-- 上传队列 -->
                <div class="upload-queue" id="uploadQueue" style="display: none;">
                    <div class="queue-header">
                        <h4><i class="fas fa-list mr-2"></i>上传队列</h4>
                        <div class="queue-actions">
                            <button class="btn-secondary" id="pauseAllBtn">
                                <i class="fas fa-pause mr-1"></i>暂停全部
                            </button>
                            <button class="btn-secondary" id="clearCompletedBtn">
                                <i class="fas fa-check mr-1"></i>清除已完成
                            </button>
                            <button class="btn-danger" id="cancelAllBtn">
                                <i class="fas fa-times mr-1"></i>取消全部
                            </button>
                        </div>
                    </div>
                    <div class="queue-stats">
                        <div class="stat-item">
                            <span class="stat-label">总文件:</span>
                            <span class="stat-value" id="totalFiles">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">已完成:</span>
                            <span class="stat-value" id="completedFiles">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">总大小:</span>
                            <span class="stat-value" id="totalSize">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">上传速度:</span>
                            <span class="stat-value" id="overallSpeed">0 B/s</span>
                        </div>
                    </div>
                    <div class="queue-list" id="queueList"></div>
                </div>

                <!-- 上传结果 -->
                <div class="upload-results" id="uploadResults" style="display: none;">
                    <div class="results-header">
                        <h4><i class="fas fa-check-circle mr-2"></i>上传完成</h4>
                        <button class="btn-primary" id="newUploadBtn">
                            <i class="fas fa-plus mr-1"></i>继续上传
                        </button>
                    </div>
                    <div class="results-list" id="resultsList"></div>
                </div>
            </div>
        `;

        this.addStyles();
    }

    addStyles() {
        if (document.getElementById('upload-component-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'upload-component-styles';
        styles.textContent = `
            .video-upload-component {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 800px;
                margin: 0 auto;
            }

            .video-upload-component.dark {
                color: #e2e8f0;
            }

            .upload-zone {
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                border: 2px dashed #475569;
                border-radius: 12px;
                padding: 40px 20px;
                text-align: center;
                transition: all 0.3s ease;
                margin-bottom: 20px;
            }

            .upload-zone.dragover {
                border-color: #3b82f6;
                background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                transform: scale(1.02);
            }

            .upload-area {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
            }

            .upload-icon {
                font-size: 4rem;
                color: #3b82f6;
                margin-bottom: 10px;
            }

            .upload-zone.dragover .upload-icon {
                color: #ffffff;
                animation: bounce 0.6s ease-in-out;
            }

            @keyframes bounce {
                0%, 20%, 60%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                80% { transform: translateY(-5px); }
            }

            .upload-text h3 {
                margin: 0 0 10px 0;
                font-size: 1.5rem;
                font-weight: 600;
                color: #ffffff;
            }

            .upload-text p {
                margin: 0 0 15px 0;
                color: #94a3b8;
                font-size: 1rem;
            }

            .upload-info {
                font-size: 0.875rem;
                color: #64748b;
                padding: 10px 20px;
                background: rgba(15, 23, 42, 0.5);
                border-radius: 8px;
                border: 1px solid #334155;
            }

            .upload-btn {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 1rem;
            }

            .upload-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
            }

            .upload-queue {
                background: #1e293b;
                border-radius: 12px;
                border: 1px solid #334155;
                margin-bottom: 20px;
            }

            .queue-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #334155;
            }

            .queue-header h4 {
                margin: 0;
                color: #ffffff;
                font-size: 1.25rem;
            }

            .queue-actions {
                display: flex;
                gap: 10px;
            }

            .btn-secondary, .btn-danger, .btn-primary {
                padding: 8px 16px;
                border-radius: 6px;
                border: none;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .btn-secondary {
                background: #475569;
                color: #e2e8f0;
            }

            .btn-secondary:hover {
                background: #64748b;
            }

            .btn-danger {
                background: #ef4444;
                color: white;
            }

            .btn-danger:hover {
                background: #dc2626;
            }

            .btn-primary {
                background: #3b82f6;
                color: white;
            }

            .btn-primary:hover {
                background: #2563eb;
            }

            .queue-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 20px;
                padding: 20px;
                background: #0f172a;
                border-radius: 8px;
                margin: 20px;
            }

            .stat-item {
                text-align: center;
            }

            .stat-label {
                display: block;
                font-size: 0.875rem;
                color: #94a3b8;
                margin-bottom: 5px;
            }

            .stat-value {
                display: block;
                font-size: 1.25rem;
                font-weight: 600;
                color: #ffffff;
            }

            .queue-list {
                padding: 0 20px 20px;
            }

            .upload-item {
                background: #334155;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 12px;
                border: 1px solid #475569;
            }

            .upload-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .file-info {
                flex: 1;
            }

            .file-name {
                font-weight: 600;
                color: #ffffff;
                margin-bottom: 4px;
            }

            .file-details {
                font-size: 0.875rem;
                color: #94a3b8;
            }

            .upload-actions {
                display: flex;
                gap: 8px;
            }

            .action-btn {
                background: none;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                padding: 4px 8px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }

            .action-btn:hover {
                background: #475569;
                color: #ffffff;
            }

            .progress-section {
                margin-bottom: 8px;
            }

            .progress-bar {
                width: 100%;
                height: 8px;
                background: #475569;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 8px;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #10b981);
                border-radius: 4px;
                transition: width 0.3s ease;
                position: relative;
            }

            .progress-fill.success {
                background: linear-gradient(90deg, #10b981, #059669);
            }

            .progress-fill.error {
                background: linear-gradient(90deg, #ef4444, #dc2626);
            }

            .progress-info {
                display: flex;
                justify-content: space-between;
                font-size: 0.75rem;
                color: #94a3b8;
            }

            .status-badge {
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 500;
                text-transform: uppercase;
            }

            .status-pending {
                background: #fbbf24;
                color: #92400e;
            }

            .status-uploading {
                background: #3b82f6;
                color: white;
            }

            .status-success {
                background: #10b981;
                color: white;
            }

            .status-error {
                background: #ef4444;
                color: white;
            }

            .status-paused {
                background: #6b7280;
                color: white;
            }

            .upload-results {
                background: #1e293b;
                border-radius: 12px;
                border: 1px solid #334155;
            }

            .results-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #334155;
            }

            .results-header h4 {
                margin: 0;
                color: #10b981;
                font-size: 1.25rem;
            }

            .results-list {
                padding: 20px;
            }

            .result-item {
                background: #334155;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 12px;
                border: 1px solid #10b981;
            }

            .result-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .result-actions {
                display: flex;
                gap: 8px;
            }

            .copy-url-btn {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 0.75rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .copy-url-btn:hover {
                background: #2563eb;
            }

            .mr-1 { margin-right: 0.25rem; }
            .mr-2 { margin-right: 0.5rem; }
        `;

        document.head.appendChild(styles);
    }

    bindEvents() {
        const uploadZone = this.container.querySelector('#uploadZone');
        const uploadArea = this.container.querySelector('#uploadArea');
        const fileInput = this.container.querySelector('#fileInput');
        const selectFileBtn = this.container.querySelector('#selectFileBtn');

        // 拖拽事件
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (!uploadZone.contains(e.relatedTarget)) {
                uploadZone.classList.remove('dragover');
            }
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        // 点击选择文件
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        selectFileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        // 队列管理按钮
        this.container.querySelector('#pauseAllBtn')?.addEventListener('click', () => this.pauseAll());
        this.container.querySelector('#clearCompletedBtn')?.addEventListener('click', () => this.clearCompleted());
        this.container.querySelector('#cancelAllBtn')?.addEventListener('click', () => this.cancelAll());
        this.container.querySelector('#newUploadBtn')?.addEventListener('click', () => this.showUploadZone());
    }

    setupUploadService() {
        this.uploadService.onUploadStart = (task) => this.onUploadStart(task);
        this.uploadService.onUploadProgress = (task) => this.onUploadProgress(task);
        this.uploadService.onUploadSuccess = (task) => this.onUploadSuccess(task);
        this.uploadService.onUploadError = (task, error) => this.onUploadError(task, error);
    }

    async handleFiles(files) {
        if (files.length === 0) return;

        // 显示上传队列
        this.showUploadQueue();

        try {
            const taskIds = await this.uploadService.uploadFiles(Array.from(files));
            console.log('开始上传文件，任务ID:', taskIds);
        } catch (error) {
            console.error('上传文件失败:', error);
            this.showError('上传失败: ' + error.message);
        }
    }

    onUploadStart(task) {
        console.log('上传开始:', task.originalName);
    }

    onUploadProgress(task) {
        console.log('上传进度:', task.originalName, task.progress + '%');
    }

    onUploadSuccess(task) {
        console.log('上传完成:', task.originalName, task.url);
    }

    onUploadError(task, error) {
        console.error('上传失败:', task.originalName, error);
    }

    showUploadQueue() {
        console.log('显示上传队列');
    }

    showError(message) {
        alert('错误: ' + message);
    }
}

// 导出组件类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoUploadComponent;
} else {
    window.VideoUploadComponent = VideoUploadComponent;
} 