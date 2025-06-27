/**
 * 后端API接口 - 腾讯云COS上传相关
 * Node.js + Express 示例代码
 */

const express = require('express');
const multer = require('multer');
const COS = require('cos-nodejs-sdk-v5');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();

// 腾讯云COS配置
const cos = new COS({
    SecretId: process.env.COS_SECRET_ID || 'AKID***************************',
    SecretKey: process.env.COS_SECRET_KEY || '********************************',
});

const BUCKET_CONFIG = {
    Bucket: 'yijianchu-videos-1234567890',
    Region: 'ap-beijing'
};

// 中间件配置
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS配置
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// 文件上传配置
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 500 * 1024 * 1024 // 500MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/flv', 'video/wmv', 'video/webm'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('不支持的文件类型'), false);
        }
    }
});

/**
 * 获取上传凭证 - STS临时密钥
 * 前端使用临时密钥上传，更安全
 */
app.post('/api/upload/credentials', async (req, res) => {
    try {
        const STS = require('qcloud-cos-sts');
        
        const policy = {
            version: '2.0',
            statement: [{
                effect: 'allow',
                action: [
                    'cos:PutObject',
                    'cos:PostObject',
                    'cos:DeleteObject',
                    'cos:GetObject'
                ],
                resource: [
                    `qcs::cos:${BUCKET_CONFIG.Region}:uid/${process.env.COS_APP_ID}:${BUCKET_CONFIG.Bucket}/videos/*`
                ]
            }]
        };

        const credentials = await STS.getCredential({
            secretId: process.env.COS_SECRET_ID,
            secretKey: process.env.COS_SECRET_KEY,
            proxy: '',
            durationSeconds: 3600, // 1小时有效期
            policy: policy
        });

        res.json({
            success: true,
            data: {
                credentials: credentials.credentials,
                expiredTime: credentials.expiredTime,
                bucket: BUCKET_CONFIG.Bucket,
                region: BUCKET_CONFIG.Region
            }
        });
    } catch (error) {
        console.error('获取上传凭证失败:', error);
        res.status(500).json({
            success: false,
            message: '获取上传凭证失败',
            error: error.message
        });
    }
});

/**
 * 直接上传文件到腾讯云COS
 */
app.post('/api/upload/video', upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: '请选择要上传的文件'
            });
        }

        const file = req.file;
        const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        const extension = path.extname(originalName);
        const timestamp = Date.now();
        const randomStr = crypto.randomBytes(8).toString('hex');
        const fileName = `${timestamp}_${randomStr}${extension}`;
        const key = `videos/${fileName}`;

        // 读取文件内容
        const fileContent = fs.readFileSync(file.path);

        // 上传到腾讯云COS
        const uploadResult = await cos.putObject({
            Bucket: BUCKET_CONFIG.Bucket,
            Region: BUCKET_CONFIG.Region,
            Key: key,
            Body: fileContent,
            ContentType: file.mimetype,
            ContentLength: file.size,
            onProgress: (progressData) => {
                console.log('上传进度:', JSON.stringify(progressData));
            }
        });

        // 删除临时文件
        fs.unlinkSync(file.path);

        // 生成访问URL
        const url = `https://${BUCKET_CONFIG.Bucket}.cos.${BUCKET_CONFIG.Region}.myqcloud.com/${key}`;

        // 保存文件信息到数据库（这里用内存模拟）
        const fileRecord = {
            id: randomStr,
            originalName: originalName,
            fileName: fileName,
            key: key,
            url: url,
            size: file.size,
            mimetype: file.mimetype,
            uploadTime: new Date(),
            etag: uploadResult.ETag
        };

        // 存储到内存（实际项目中应该存储到数据库）
        if (!global.uploadedFiles) {
            global.uploadedFiles = [];
        }
        global.uploadedFiles.push(fileRecord);

        res.json({
            success: true,
            message: '文件上传成功',
            data: fileRecord
        });

    } catch (error) {
        console.error('文件上传失败:', error);
        
        // 清理临时文件
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: '文件上传失败',
            error: error.message
        });
    }
});

/**
 * 获取上传文件列表
 */
app.get('/api/upload/files', (req, res) => {
    try {
        const files = global.uploadedFiles || [];
        
        // 分页参数
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const paginatedFiles = files.slice(offset, offset + limit);

        res.json({
            success: true,
            data: {
                files: paginatedFiles,
                total: files.length,
                page: page,
                limit: limit,
                totalPages: Math.ceil(files.length / limit)
            }
        });
    } catch (error) {
        console.error('获取文件列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取文件列表失败',
            error: error.message
        });
    }
});

/**
 * 删除文件
 */
app.delete('/api/upload/files/:id', async (req, res) => {
    try {
        const fileId = req.params.id;
        const files = global.uploadedFiles || [];
        const fileIndex = files.findIndex(f => f.id === fileId);

        if (fileIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '文件不存在'
            });
        }

        const file = files[fileIndex];

        // 从腾讯云COS删除文件
        await cos.deleteObject({
            Bucket: BUCKET_CONFIG.Bucket,
            Region: BUCKET_CONFIG.Region,
            Key: file.key
        });

        // 从内存中删除记录
        files.splice(fileIndex, 1);

        res.json({
            success: true,
            message: '文件删除成功'
        });

    } catch (error) {
        console.error('删除文件失败:', error);
        res.status(500).json({
            success: false,
            message: '删除文件失败',
            error: error.message
        });
    }
});

/**
 * 生成预签名URL
 */
app.post('/api/upload/presign', (req, res) => {
    try {
        const { key, expires = 3600 } = req.body;

        if (!key) {
            return res.status(400).json({
                success: false,
                message: '缺少文件路径参数'
            });
        }

        const url = cos.getObjectUrl({
            Bucket: BUCKET_CONFIG.Bucket,
            Region: BUCKET_CONFIG.Region,
            Key: key,
            Expires: expires,
            Sign: true
        });

        res.json({
            success: true,
            data: {
                url: url,
                expires: expires
            }
        });

    } catch (error) {
        console.error('生成预签名URL失败:', error);
        res.status(500).json({
            success: false,
            message: '生成预签名URL失败',
            error: error.message
        });
    }
});

/**
 * 获取存储桶状态
 */
app.get('/api/upload/bucket/status', async (req, res) => {
    try {
        // 获取存储桶信息
        const bucketInfo = await cos.headBucket({
            Bucket: BUCKET_CONFIG.Bucket,
            Region: BUCKET_CONFIG.Region
        });

        // 获取存储桶下的文件列表（用于统计）
        const listResult = await cos.getBucket({
            Bucket: BUCKET_CONFIG.Bucket,
            Region: BUCKET_CONFIG.Region,
            Prefix: 'videos/',
            MaxKeys: 1000
        });

        const totalFiles = listResult.Contents.length;
        const totalSize = listResult.Contents.reduce((sum, file) => sum + parseInt(file.Size), 0);

        res.json({
            success: true,
            data: {
                bucket: BUCKET_CONFIG.Bucket,
                region: BUCKET_CONFIG.Region,
                totalFiles: totalFiles,
                totalSize: totalSize,
                lastModified: bucketInfo.headers['last-modified']
            }
        });

    } catch (error) {
        console.error('获取存储桶状态失败:', error);
        res.status(500).json({
            success: false,
            message: '获取存储桶状态失败',
            error: error.message
        });
    }
});

/**
 * 批量删除文件
 */
app.post('/api/upload/files/batch-delete', async (req, res) => {
    try {
        const { keys } = req.body;

        if (!Array.isArray(keys) || keys.length === 0) {
            return res.status(400).json({
                success: false,
                message: '请提供要删除的文件列表'
            });
        }

        // 批量删除COS中的文件
        const deleteResult = await cos.deleteMultipleObject({
            Bucket: BUCKET_CONFIG.Bucket,
            Region: BUCKET_CONFIG.Region,
            Objects: keys.map(key => ({ Key: key }))
        });

        // 从内存中删除对应记录
        const files = global.uploadedFiles || [];
        global.uploadedFiles = files.filter(file => !keys.includes(file.key));

        res.json({
            success: true,
            message: `成功删除 ${keys.length} 个文件`,
            data: {
                deleted: deleteResult.Deleted,
                errors: deleteResult.Error || []
            }
        });

    } catch (error) {
        console.error('批量删除文件失败:', error);
        res.status(500).json({
            success: false,
            message: '批量删除文件失败',
            error: error.message
        });
    }
});

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('服务器错误:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: '文件大小超过限制（最大500MB）'
            });
        }
    }
    
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: error.message
    });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器启动成功，端口: ${PORT}`);
    console.log(`上传API: http://localhost:${PORT}/api/upload/video`);
    console.log(`获取凭证: http://localhost:${PORT}/api/upload/credentials`);
});

module.exports = app; 