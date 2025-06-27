/**
 * 腾讯云COS配置文件
 * 注意：生产环境中请将敏感信息存储在环境变量或服务器端
 */

// 腾讯云COS配置
const TENCENT_COS_CONFIG = {
    // 基础配置
    SecretId: process.env.COS_SECRET_ID || 'AKID***************************', // 请替换为您的SecretId
    SecretKey: process.env.COS_SECRET_KEY || '********************************', // 请替换为您的SecretKey
    
    // 存储桶配置
    Bucket: 'yijianchu-videos-1234567890', // 存储桶名称，格式：BucketName-APPID
    Region: 'ap-beijing', // 存储桶所在地域
    
    // 上传配置
    uploadPath: 'videos/', // 上传路径前缀
    maxFileSize: 500 * 1024 * 1024, // 最大文件大小：500MB
    chunkSize: 1024 * 1024, // 分片大小：1MB
    allowedTypes: ['mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'webm'], // 允许的文件类型
    
    // CDN配置（可选）
    CDNDomain: '', // 如果配置了CDN，填写CDN域名
    
    // 访问控制
    enableHttps: true, // 是否启用HTTPS
    defaultACL: 'public-read', // 默认访问权限：public-read | private
    
    // 高级配置
    FileParallelLimit: 3, // 文件上传并发数
    ChunkParallelLimit: 3, // 分片上传并发数
    SliceSize: 1024 * 1024, // 启用分片上传的文件大小阈值
    
    // 生命周期配置
    lifecycle: {
        enabled: false, // 是否启用生命周期管理
        rules: [
            {
                id: 'DeleteIncompleteMultipartUploads',
                status: 'Enabled',
                filter: { prefix: 'videos/' },
                abortIncompleteMultipartUpload: { daysAfterInitiation: 7 }
            }
        ]
    },
    
    // 跨域配置
    cors: {
        enabled: true,
        rules: [
            {
                allowedOrigins: ['*'], // 生产环境请替换为具体域名
                allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
                allowedHeaders: ['*'],
                maxAgeSeconds: 3600
            }
        ]
    }
};

// 环境相关配置
const ENVIRONMENT_CONFIG = {
    development: {
        ...TENCENT_COS_CONFIG,
        uploadPath: 'dev/videos/',
        debug: true
    },
    
    staging: {
        ...TENCENT_COS_CONFIG,
        uploadPath: 'staging/videos/',
        debug: false
    },
    
    production: {
        ...TENCENT_COS_CONFIG,
        uploadPath: 'prod/videos/',
        debug: false,
        enableHttps: true
    }
};

// 获取当前环境配置
function getConfig() {
    const env = process.env.NODE_ENV || 'development';
    return ENVIRONMENT_CONFIG[env] || ENVIRONMENT_CONFIG.development;
}

// 文件类型配置
const FILE_TYPE_CONFIG = {
    video: {
        allowedTypes: ['mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'webm'],
        maxSize: 500 * 1024 * 1024, // 500MB
        uploadPath: 'videos/'
    },
    
    thumbnail: {
        allowedTypes: ['jpg', 'jpeg', 'png', 'webp'],
        maxSize: 10 * 1024 * 1024, // 10MB
        uploadPath: 'thumbnails/'
    },
    
    subtitle: {
        allowedTypes: ['srt', 'vtt', 'ass'],
        maxSize: 1024 * 1024, // 1MB
        uploadPath: 'subtitles/'
    }
};

// 上传配置预设
const UPLOAD_PRESETS = {
    // 标清视频
    standard: {
        maxFileSize: 100 * 1024 * 1024, // 100MB
        chunkSize: 512 * 1024, // 512KB
        quality: 'standard'
    },
    
    // 高清视频
    hd: {
        maxFileSize: 300 * 1024 * 1024, // 300MB
        chunkSize: 1024 * 1024, // 1MB
        quality: 'hd'
    },
    
    // 超清视频
    uhd: {
        maxFileSize: 500 * 1024 * 1024, // 500MB
        chunkSize: 2 * 1024 * 1024, // 2MB
        quality: 'uhd'
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TENCENT_COS_CONFIG,
        ENVIRONMENT_CONFIG,
        FILE_TYPE_CONFIG,
        UPLOAD_PRESETS,
        getConfig
    };
} else {
    window.TencentCOSConfig = {
        TENCENT_COS_CONFIG,
        ENVIRONMENT_CONFIG,
        FILE_TYPE_CONFIG,
        UPLOAD_PRESETS,
        getConfig
    };
} 