// 一键出片 - 纯前端视频处理模拟器
class VideoProcessor {
    constructor() {
        this.capabilities = {
            eraser: {
                name: '智能擦除',
                description: '使用AI技术自动识别和去除视频中的字幕、水印、Logo等元素，保持视频内容的完整性。',
                price: '¥2/分钟',
                pricePerMinute: 2,
                icon: 'fas fa-eraser',
                color: 'from-blue-500 to-blue-600'
            },
            trim: {
                name: '视频剪辑',
                description: '精确裁剪视频片段，支持按时间点分割、多段合并，快速制作精彩集锦。',
                price: '¥1.5/分钟',
                pricePerMinute: 1.5,
                icon: 'fas fa-cut',
                color: 'from-green-500 to-green-600'
            },
            compress: {
                name: '格式转换',
                description: '智能压缩视频文件大小，支持多种格式转换，保持画质的同时减少存储空间。',
                price: '¥1/分钟',
                pricePerMinute: 1,
                icon: 'fas fa-compress-alt',
                color: 'from-purple-500 to-purple-600'
            },
            filter: {
                name: '滤镜特效',
                description: '丰富的滤镜和特效库，一键美化视频画面，提升视觉效果和观感体验。',
                price: '¥2.5/分钟',
                pricePerMinute: 2.5,
                icon: 'fas fa-palette',
                color: 'from-pink-500 to-pink-600'
            },
            enhance: {
                name: '画质增强',
                description: 'AI画质增强技术，去除噪点、提升清晰度，让老视频焕发新生。',
                price: '¥3/分钟',
                pricePerMinute: 3,
                icon: 'fas fa-magic',
                color: 'from-yellow-500 to-yellow-600'
            },
            background: {
                name: '背景处理',
                description: '智能识别人物主体，替换或模糊背景，创造专业级视频效果。',
                price: '¥4/分钟',
                pricePerMinute: 4,
                icon: 'fas fa-image',
                color: 'from-cyan-500 to-cyan-600'
            },
            subtitle: {
                name: '字幕处理',
                description: '自动提取视频字幕，支持多语言识别，或为视频添加自定义字幕。',
                price: '¥1.5/分钟',
                pricePerMinute: 1.5,
                icon: 'fas fa-closed-captioning',
                color: 'from-indigo-500 to-indigo-600'
            },
            watermark: {
                name: '水印管理',
                description: '为视频添加个性化水印，支持文字、图片水印，保护原创内容。',
                price: '¥1/分钟',
                pricePerMinute: 1,
                icon: 'fas fa-copyright',
                color: 'from-orange-500 to-orange-600'
            }
        };
        
        this.selectedCapability = 'eraser';
        this.uploadedFile = null;
        this.isProcessing = false;
    }

    // 获取能力信息
    getCapability(capabilityId) {
        return this.capabilities[capabilityId] || this.capabilities.eraser;
    }

    // 选择处理能力
    selectCapability(capabilityId) {
        if (this.capabilities[capabilityId]) {
            this.selectedCapability = capabilityId;
            this.updateUI();
            return true;
        }
        return false;
    }

    // 处理文件上传
    handleFileUpload(file) {
        // 验证文件类型
        if (!file.type.startsWith('video/')) {
            this.showNotification('请选择视频文件！', 'error');
            return false;
        }

        // 验证文件大小（500MB限制）
        if (file.size > 500 * 1024 * 1024) {
            this.showNotification('文件大小不能超过500MB！', 'error');
            return false;
        }

        this.uploadedFile = file;
        this.updateFileInfo();
        this.updateCostEstimate();
        this.showNotification('文件上传成功！', 'success');
        return true;
    }

    // 开始处理视频
    async startProcessing() {
        if (!this.uploadedFile || this.isProcessing) {
            return false;
        }

        this.isProcessing = true;
        const capability = this.getCapability(this.selectedCapability);
        
        try {
            await this.simulateProcessing(capability);
            this.showNotification(`${capability.name}处理完成！`, 'success');
        } catch (error) {
            this.showNotification(`处理失败：${error.message}`, 'error');
        } finally {
            this.isProcessing = false;
        }
    }

    // 模拟视频处理过程
    async simulateProcessing(capability) {
        return new Promise((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    this.updateProcessProgress(progress, capability.name, true);
                    resolve();
                } else {
                    this.updateProcessProgress(progress, capability.name, false);
                }
            }, 300);
        });
    }

    // 更新处理进度
    updateProcessProgress(progress, capabilityName, completed = false) {
        const event = new CustomEvent('processingProgress', {
            detail: {
                progress: Math.floor(progress),
                capabilityName,
                completed
            }
        });
        document.dispatchEvent(event);
    }

    // 估算视频时长和费用
    estimateVideoData(file) {
        // 简单的基于文件大小的时长估算
        const estimatedMinutes = Math.max(1, Math.floor(file.size / (1024 * 1024) / 10));
        const capability = this.getCapability(this.selectedCapability);
        const totalCost = estimatedMinutes * capability.pricePerMinute;
        
        return {
            duration: estimatedMinutes,
            cost: totalCost,
            freeTrialCost: Math.max(0, (estimatedMinutes - 10) * capability.pricePerMinute)
        };
    }

    // 更新费用预估
    updateCostEstimate() {
        if (!this.uploadedFile) return;

        const estimation = this.estimateVideoData(this.uploadedFile);
        const event = new CustomEvent('costUpdated', {
            detail: estimation
        });
        document.dispatchEvent(event);
    }

    // 更新文件信息显示
    updateFileInfo() {
        if (!this.uploadedFile) return;

        const fileInfo = {
            name: this.uploadedFile.name,
            size: (this.uploadedFile.size / (1024 * 1024)).toFixed(2),
            capability: this.getCapability(this.selectedCapability).name
        };

        const event = new CustomEvent('fileInfoUpdated', {
            detail: fileInfo
        });
        document.dispatchEvent(event);
    }

    // 更新UI
    updateUI() {
        const event = new CustomEvent('capabilityChanged', {
            detail: {
                capability: this.getCapability(this.selectedCapability),
                capabilityId: this.selectedCapability
            }
        });
        document.dispatchEvent(event);
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const event = new CustomEvent('notification', {
            detail: { message, type }
        });
        document.dispatchEvent(event);
    }

    // 移除文件
    removeFile() {
        this.uploadedFile = null;
        const event = new CustomEvent('fileRemoved');
        document.dispatchEvent(event);
    }

    // 生成配置面板HTML
    generateConfigHTML(capabilityId) {
        const capability = this.getCapability(capabilityId);
        
        switch(capabilityId) {
            case 'eraser':
                return `
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">处理质量</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-blue-600 text-white text-sm py-3 px-4 rounded-lg text-left">
                                    <div class="font-semibold">高清 1080p</div>
                                    <div class="text-xs text-blue-200">推荐设置 - ¥2/分钟</div>
                                </button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-3 px-4 rounded-lg hover:bg-slate-600 text-left">
                                    <div class="font-semibold">标清 720p</div>
                                    <div class="text-xs text-gray-400">经济选择 - ¥1/分钟</div>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">擦除模式</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-green-600 text-white text-sm py-3 px-4 rounded-lg text-left">
                                    <div class="font-semibold">🤖 AI自动识别</div>
                                    <div class="text-xs text-green-200">智能检测字幕水印</div>
                                </button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-3 px-4 rounded-lg hover:bg-slate-600 text-left" disabled>
                                    <div class="font-semibold">✋ 手动选择区域</div>
                                    <div class="text-xs text-gray-400">Pro版本功能</div>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            
            case 'trim':
                return `
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">剪辑模式</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-blue-600 text-white text-sm py-3 px-4 rounded-lg text-left">
                                    <div class="font-semibold">智能剪辑</div>
                                    <div class="text-xs text-blue-200">AI识别精彩片段</div>
                                </button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-3 px-4 rounded-lg hover:bg-slate-600 text-left">
                                    <div class="font-semibold">时间点剪辑</div>
                                    <div class="text-xs text-gray-400">手动设定时间范围</div>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">时间范围（秒）</label>
                            <div class="grid grid-cols-2 gap-2">
                                <input type="number" placeholder="开始" class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                                <input type="number" placeholder="结束" class="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                            </div>
                        </div>
                    </div>
                `;
            
            case 'compress':
                return `
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">输出格式</label>
                            <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                                <option>MP4 (推荐)</option>
                                <option>AVI</option>
                                <option>MOV</option>
                                <option>MKV</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">压缩程度</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-blue-600 text-white text-sm py-2 px-3 rounded-lg">高质量</button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-2 px-3 rounded-lg hover:bg-slate-600">平衡</button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-2 px-3 rounded-lg hover:bg-slate-600">高压缩</button>
                            </div>
                        </div>
                    </div>
                `;
            
            case 'filter':
                return `
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">滤镜类型</label>
                            <div class="grid grid-cols-2 gap-2">
                                <button class="bg-blue-600 text-white text-xs py-2 px-2 rounded">复古</button>
                                <button class="bg-slate-700 text-gray-300 text-xs py-2 px-2 rounded hover:bg-slate-600">清新</button>
                                <button class="bg-slate-700 text-gray-300 text-xs py-2 px-2 rounded hover:bg-slate-600">暖调</button>
                                <button class="bg-slate-700 text-gray-300 text-xs py-2 px-2 rounded hover:bg-slate-600">冷调</button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">强度调节</label>
                            <input type="range" class="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer" min="0" max="100" value="50">
                        </div>
                    </div>
                `;
            
            default:
                return `
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">处理模式</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-blue-600 text-white text-sm py-3 px-4 rounded-lg text-left">
                                    <div class="font-semibold">标准模式</div>
                                    <div class="text-xs text-blue-200">平衡质量和速度</div>
                                </button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-3 px-4 rounded-lg hover:bg-slate-600 text-left">
                                    <div class="font-semibold">高质量模式</div>
                                    <div class="text-xs text-gray-400">更好效果，耗时较长</div>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
        }
    }
}

// 创建全局实例
window.videoProcessor = new VideoProcessor(); 