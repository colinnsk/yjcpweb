# 一键出片 - 腾讯云视频上传功能

## 🎥 功能概述

本项目实现了完整的视频上传到腾讯云对象存储（COS）的解决方案，包括前端上传组件、后端API接口和云存储集成。

## 🏗️ 架构设计

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端组件       │    │   后端API       │    │   腾讯云COS     │
│                 │    │                 │    │                 │
│ - 拖拽上传       │───▶│ - 文件验证       │───▶│ - 对象存储       │
│ - 进度显示       │    │ - 分片上传       │    │ - CDN加速       │
│ - 队列管理       │    │ - 临时密钥       │    │ - 生命周期       │
│ - 断点续传       │    │ - 批量操作       │    │ - 访问控制       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 文件结构

```
.
├── upload-service.js      # 核心上传服务类
├── upload-component.js    # 可视化上传组件
├── config.js             # 配置文件
├── backend-api.js        # 后端API接口
├── workspace.html        # 集成示例页面
├── package.json          # 项目依赖
└── README_upload.md      # 使用说明
```

## 🚀 快速开始

### 1. 环境准备

```bash
# 安装依赖
npm install

# 设置环境变量
export COS_SECRET_ID="你的SecretId"
export COS_SECRET_KEY="你的SecretKey"
export COS_APP_ID="你的APPID"
```

### 2. 腾讯云COS配置

```javascript
// config.js
const TENCENT_COS_CONFIG = {
    SecretId: 'AKID***************************',
    SecretKey: '********************************',
    Bucket: 'yijianchu-videos-1234567890',
    Region: 'ap-beijing',
    uploadPath: 'videos/',
    maxFileSize: 500 * 1024 * 1024, // 500MB
    allowedTypes: ['mp4', 'avi', 'mov', 'mkv', 'flv', 'wmv', 'webm']
};
```

### 3. 前端集成

```html
<!-- 引入必要的依赖 -->
<script src="https://unpkg.com/cos-js-sdk-v5/dist/cos-js-sdk-v5.min.js"></script>
<script src="config.js"></script>
<script src="upload-service.js"></script>
<script src="upload-component.js"></script>

<!-- 上传容器 -->
<div id="videoUploadContainer"></div>

<script>
// 初始化上传服务
const config = TencentCOSConfig.getConfig();
const uploadService = new TencentCOSUploadService(config);

// 初始化上传组件
const uploadComponent = new VideoUploadComponent(
    'videoUploadContainer', 
    uploadService, 
    {
        theme: 'dark',
        multiple: true,
        showPreview: true
    }
);

// 设置事件回调
uploadService.onUploadSuccess = function(task) {
    console.log('上传成功:', task.url);
};
</script>
```

### 4. 后端服务

```bash
# 启动开发服务器
npm run dev

# 生产环境启动
npm start
```

## 🔧 API接口

### 获取上传凭证
```http
POST /api/upload/credentials
```

### 上传视频文件
```http
POST /api/upload/video
Content-Type: multipart/form-data

video: [文件]
```

### 获取文件列表
```http
GET /api/upload/files?page=1&limit=10
```

### 删除文件
```http
DELETE /api/upload/files/:id
```

### 批量删除
```http
POST /api/upload/files/batch-delete
Content-Type: application/json

{
  "keys": ["videos/file1.mp4", "videos/file2.mp4"]
}
```

## 🎯 核心功能

### 1. 文件上传

- **拖拽上传**: 支持拖拽文件到指定区域
- **点击选择**: 点击按钮选择文件
- **批量上传**: 同时上传多个文件
- **文件验证**: 类型、大小、格式检查

### 2. 上传管理

- **进度显示**: 实时显示上传进度
- **速度监控**: 显示上传速度和剩余时间
- **队列管理**: 上传队列的暂停、恢复、取消
- **错误处理**: 上传失败的重试机制

### 3. 存储功能

- **分片上传**: 大文件自动分片上传
- **断点续传**: 支持断点续传（SDK层面）
- **并发控制**: 控制并发上传数量
- **存储优化**: 自动压缩和格式转换

### 4. 安全特性

- **临时密钥**: 使用STS临时密钥上传
- **访问控制**: 基于策略的访问控制
- **签名验证**: URL签名验证
- **HTTPS传输**: 强制HTTPS传输

## 🎨 UI组件特性

### 上传区域
- 现代化深色主题设计
- 拖拽高亮效果
- 动画反馈
- 响应式布局

### 进度显示
- 彩色进度条
- 百分比显示
- 上传速度
- 剩余时间计算

### 队列管理
- 文件列表显示
- 批量操作按钮
- 状态标签
- 操作按钮

### 结果展示
- 上传成功列表
- URL复制功能
- 预览链接
- 重新上传选项

## 📊 监控统计

### 上传统计
```javascript
// 获取上传统计
const stats = uploadService.getStats();
console.log({
    totalFiles: stats.totalFiles,
    successFiles: stats.successFiles,
    failedFiles: stats.failedFiles,
    totalSize: stats.totalSize,
    averageSpeed: stats.averageSpeed
});
```

### 实时监控
```javascript
// 设置监控回调
uploadService.onUploadProgress = function(task) {
    updateDashboard({
        fileName: task.originalName,
        progress: task.progress,
        speed: task.speed,
        timeRemaining: task.timeRemaining
    });
};
```

## 🔍 错误处理

### 常见错误类型

1. **文件类型不支持**
   ```
   错误码: FILE_TYPE_NOT_SUPPORTED
   解决方案: 检查allowedTypes配置
   ```

2. **文件大小超限**
   ```
   错误码: FILE_SIZE_EXCEEDED
   解决方案: 调整maxFileSize配置
   ```

3. **网络连接错误**
   ```
   错误码: NETWORK_ERROR
   解决方案: 检查网络连接和COS配置
   ```

4. **权限不足**
   ```
   错误码: ACCESS_DENIED
   解决方案: 检查SecretId/SecretKey和存储桶权限
   ```

### 错误处理示例
```javascript
uploadService.onUploadError = function(task, error) {
    console.error('上传失败:', {
        fileName: task.originalName,
        errorCode: error.code,
        errorMessage: error.message
    });
    
    // 根据错误类型处理
    switch(error.code) {
        case 'FILE_TYPE_NOT_SUPPORTED':
            showNotification('不支持的文件格式', 'warning');
            break;
        case 'FILE_SIZE_EXCEEDED':
            showNotification('文件大小超过限制', 'error');
            break;
        default:
            showNotification('上传失败，请重试', 'error');
    }
};
```

## 🚀 性能优化

### 上传优化
- 分片并发上传
- 智能重试机制
- 网络自适应调节
- 缓存机制

### 前端优化
- 虚拟滚动
- 防抖处理
- 内存管理
- 组件懒加载

### 后端优化
- 连接池管理
- 请求限流
- 缓存策略
- 日志监控

## 🛡️ 安全建议

1. **密钥管理**
   - 使用环境变量存储密钥
   - 定期轮换密钥
   - 最小权限原则

2. **访问控制**
   - 配置CORS规则
   - 使用临时密钥
   - IP白名单限制

3. **数据保护**
   - 启用HTTPS传输
   - 文件加密存储
   - 访问日志审计

## 📝 使用示例

### 基础使用
```javascript
// 简单上传
const file = document.getElementById('fileInput').files[0];
const taskId = await uploadService.uploadFile(file);

// 监听进度
uploadService.onUploadProgress = (task) => {
    console.log(`${task.originalName}: ${task.progress}%`);
};
```

### 高级使用
```javascript
// 批量上传
const files = Array.from(fileInput.files);
const taskIds = await uploadService.uploadFiles(files, {
    onFileStart: (task) => console.log('开始:', task.originalName),
    onFileComplete: (task) => console.log('完成:', task.originalName),
    onFileError: (task, error) => console.log('失败:', task.originalName, error)
});

// 队列管理
uploadService.pauseAll();  // 暂停所有
uploadService.resumeAll(); // 恢复所有
uploadService.cancelAll(); // 取消所有
```

## 🐛 故障排除

### 常见问题

1. **上传组件不显示**
   - 检查容器元素是否存在
   - 确认所有依赖已正确加载
   - 查看浏览器控制台错误

2. **上传失败**
   - 验证COS配置是否正确
   - 检查网络连接
   - 确认文件格式和大小

3. **进度不更新**
   - 确认事件回调已正确设置
   - 检查浏览器兼容性
   - 验证COS SDK版本

### 调试模式
```javascript
// 启用调试模式
const config = {
    ...TencentCOSConfig.getConfig(),
    debug: true
};

const uploadService = new TencentCOSUploadService(config);
```

## 📞 技术支持

如果您在使用过程中遇到问题，可以通过以下方式获取帮助：

1. 查看[腾讯云COS官方文档](https://cloud.tencent.com/document/product/436)
2. 提交[GitHub Issue](https://github.com/yijianchu/video-upload/issues)
3. 联系技术支持邮箱：support@yijianchu.com

## 📄 开源协议

本项目基于MIT协议开源，详情请参阅LICENSE文件。 