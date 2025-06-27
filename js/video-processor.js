// 一键出片 - 纯前端视频处理模拟器
class VideoProcessor {
    constructor() {
        this.capabilities = {
            removeSubtitle: {
                name: '去除字幕',
                description: 'AI智能识别视频中的字幕文字，精准去除不同样式的字幕内容，保持视频画面完整性。',
                price: '¥2/分钟',
                pricePerMinute: 2,
                icon: 'fas fa-text-slash',
                color: 'from-blue-500 to-blue-600'
            },
            removeWatermark: {
                name: '去除水印',
                description: '智能检测和去除视频中的水印标识，支持透明水印、角标水印等多种类型。',
                price: '¥2.5/分钟',
                pricePerMinute: 2.5,
                icon: 'fas fa-droplet-slash',
                color: 'from-green-500 to-green-600'
            },
            removeLogo: {
                name: '去除Logo',
                description: '精准识别并去除视频中的品牌Logo、台标等图形标识，保持视频内容纯净。',
                price: '¥2/分钟',
                pricePerMinute: 2,
                icon: 'fas fa-ban',
                color: 'from-purple-500 to-purple-600'
            },
            textExtract: {
                name: '视频文案提取',
                description: '自动识别视频中的语音内容，转换为可编辑的文字稿，支持多语言识别和时间戳标注。',
                price: '¥1.5/分钟',
                pricePerMinute: 1.5,
                icon: 'fas fa-file-text',
                color: 'from-indigo-500 to-indigo-600'
            },
            translate: {
                name: '视频翻译',
                description: '智能识别视频语音，将其翻译成目标语言并生成对应字幕，支持30+语言互译。',
                price: '¥3/分钟',
                pricePerMinute: 3,
                icon: 'fas fa-language',
                color: 'from-orange-500 to-orange-600'
            },
            voiceClone: {
                name: '声音克隆',
                description: '通过用户上传的音频样本，克隆生成个性化声音，仅限用于数智人视频的语音合成。',
                price: '¥10/次',
                pricePerMinute: 10,
                icon: 'fas fa-microphone-alt',
                color: 'from-pink-500 to-pink-600',
                isPerUse: true  // 标记为按次收费
            },
            digitalHuman: {
                name: '数智人生成',
                description: '无需训练，用户输入视频素材和文本/语音内容，快速生成数智人视频',
                price: '¥15/次',
                pricePerMinute: 15,
                icon: 'fas fa-user-astronaut',
                color: 'from-cyan-500 to-blue-600',
                isPerUse: true  // 标记为按次收费
            }
        };
        
        this.selectedCapability = 'removeSubtitle';
        this.uploadedFile = null;
        this.isProcessing = false;
    }

    // 获取能力信息
    getCapability(capabilityId) {
        return this.capabilities[capabilityId] || this.capabilities.removeSubtitle;
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
        const capability = this.getCapability(this.selectedCapability);
        
        // 声音克隆功能的特殊处理
        if (this.selectedCapability === 'voiceClone') {
            // 验证音频文件类型
            const audioTypes = ['audio/wav', 'audio/mp3', 'audio/aac', 'audio/m4a', 'audio/x-m4a', 'audio/wma', 'audio/asf'];
            if (!audioTypes.some(type => file.type.includes(type.split('/')[1]))) {
                this.showNotification('请选择音频文件（支持 wav、mp3、aac、m4a、wma、asf 格式）！', 'error');
                return false;
            }

            // 验证音频文件大小（5MB限制）
            if (file.size > 5 * 1024 * 1024) {
                this.showNotification('音频文件大小不能超过5MB！', 'error');
                return false;
            }

            // 建议音频长度检查（这里简单估算，实际需要音频解析）
            const estimatedDuration = file.size / (128 * 1024 / 8); // 假设128kbps码率
            if (estimatedDuration < 15) {
                this.showNotification('建议上传15-20秒长度的音频样本以获得最佳克隆效果！', 'warning');
            }
        } else if (this.selectedCapability === 'digitalHuman') {
            // 数智人生成功能支持视频和音频文件
            const videoTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/mkv'];
            const audioTypes = ['audio/wav', 'audio/mp3', 'audio/aac', 'audio/m4a', 'audio/x-m4a'];
            
            const isVideo = videoTypes.some(type => file.type === type);
            const isAudio = audioTypes.some(type => file.type.includes(type.split('/')[1]));
            
            if (!isVideo && !isAudio) {
                this.showNotification('请选择视频文件（用作数智人素材）或音频文件（用作语音内容）！', 'error');
                return false;
            }

            if (isVideo) {
                // 验证视频文件（5秒～120秒）
                if (file.size > 200 * 1024 * 1024) {
                    this.showNotification('视频文件大小不能超过200MB！', 'error');
                    return false;
                }
                
                // 估算视频时长
                const estimatedDuration = file.size / (1024 * 1024) * 8; // 粗略估算
                if (estimatedDuration < 5) {
                    this.showNotification('视频素材建议5秒以上，以获得更好的数智人效果！', 'warning');
                } else if (estimatedDuration > 120) {
                    this.showNotification('视频素材超过120秒，建议截取精彩片段！', 'warning');
                }
            }

            if (isAudio) {
                // 验证音频文件大小（10MB限制）
                if (file.size > 10 * 1024 * 1024) {
                    this.showNotification('音频文件大小不能超过10MB！', 'error');
                    return false;
                }
            }
        } else {
            // 其他功能验证视频文件类型
            if (!file.type.startsWith('video/')) {
                this.showNotification('请选择视频文件！', 'error');
                return false;
            }

            // 验证视频文件大小（500MB限制）
            if (file.size > 500 * 1024 * 1024) {
                this.showNotification('文件大小不能超过500MB！', 'error');
                return false;
            }
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
        const capability = this.getCapability(this.selectedCapability);
        
        // 按次收费的功能
        if (capability.isPerUse) {
            return {
                duration: 1,
                cost: capability.pricePerMinute,
                freeTrialCost: capability.pricePerMinute, // 按次收费不享受免费试用
                isPerUse: true
            };
        }
        
        // 其他功能按分钟计费
        const estimatedMinutes = Math.max(1, Math.floor(file.size / (1024 * 1024) / 10));
        const totalCost = estimatedMinutes * capability.pricePerMinute;
        
        return {
            duration: estimatedMinutes,
            cost: totalCost,
            freeTrialCost: Math.max(0, (estimatedMinutes - 1) * capability.pricePerMinute) // 改为1分钟免费试用
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
            case 'removeSubtitle':
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
                                    <div class="text-xs text-gray-400">经济选择 - ¥1.5/分钟</div>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">识别模式</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-green-600 text-white text-sm py-3 px-4 rounded-lg text-left">
                                    <div class="font-semibold">🤖 AI自动识别</div>
                                    <div class="text-xs text-green-200">智能检测各种字幕样式</div>
                                </button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-3 px-4 rounded-lg hover:bg-slate-600 text-left">
                                    <div class="font-semibold">✋ 手动选择区域</div>
                                    <div class="text-xs text-gray-400">精确指定字幕区域</div>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            
            case 'removeWatermark':
                return `
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">水印类型</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-blue-600 text-white text-sm py-2 px-3 rounded-lg">透明水印</button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-2 px-3 rounded-lg hover:bg-slate-600">角标水印</button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-2 px-3 rounded-lg hover:bg-slate-600">全屏水印</button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">检测模式</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-green-600 text-white text-sm py-3 px-4 rounded-lg text-left">
                                    <div class="font-semibold">🤖 AI自动识别</div>
                                    <div class="text-xs text-green-200">智能检测水印位置</div>
                                </button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-3 px-4 rounded-lg hover:bg-slate-600 text-left">
                                    <div class="font-semibold">✋ 手动选择区域</div>
                                    <div class="text-xs text-gray-400">手动框选水印区域</div>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            
            case 'removeLogo':
                return `
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">Logo类型</label>
                            <div class="grid grid-cols-2 gap-2">
                                <button class="bg-blue-600 text-white text-xs py-2 px-2 rounded">台标</button>
                                <button class="bg-slate-700 text-gray-300 text-xs py-2 px-2 rounded hover:bg-slate-600">品牌Logo</button>
                                <button class="bg-slate-700 text-gray-300 text-xs py-2 px-2 rounded hover:bg-slate-600">角标</button>
                                <button class="bg-slate-700 text-gray-300 text-xs py-2 px-2 rounded hover:bg-slate-600">其他图标</button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">识别模式</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-green-600 text-white text-sm py-3 px-4 rounded-lg text-left">
                                    <div class="font-semibold">🤖 AI自动识别</div>
                                    <div class="text-xs text-green-200">智能检测Logo区域</div>
                                </button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-3 px-4 rounded-lg hover:bg-slate-600 text-left">
                                    <div class="font-semibold">✋ 手动选择区域</div>
                                    <div class="text-xs text-gray-400">精确框选Logo位置</div>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            
            case 'textExtract':
                return `
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">识别语言</label>
                            <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                                <option>中文（简体）</option>
                                <option>中文（繁体）</option>
                                <option>英语</option>
                                <option>日语</option>
                                <option>韩语</option>
                                <option>自动检测</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">输出格式</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-blue-600 text-white text-sm py-2 px-3 rounded-lg">纯文本</button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-2 px-3 rounded-lg hover:bg-slate-600">带时间戳</button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-2 px-3 rounded-lg hover:bg-slate-600">SRT字幕</button>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">识别精度</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-green-600 text-white text-sm py-2 px-3 rounded-lg">高精度（推荐）</button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-2 px-3 rounded-lg hover:bg-slate-600">标准</button>
                            </div>
                        </div>
                    </div>
                `;
            
            case 'translate':
                return `
                    <div class="space-y-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">源语言</label>
                            <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                                <option>自动检测</option>
                                <option>中文</option>
                                <option>英语</option>
                                <option>日语</option>
                                <option>韩语</option>
                                <option>法语</option>
                                <option>德语</option>
                                <option>西班牙语</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">目标语言</label>
                            <select class="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm">
                                <option>英语</option>
                                <option>中文（简体）</option>
                                <option>中文（繁体）</option>
                                <option>日语</option>
                                <option>韩语</option>
                                <option>法语</option>
                                <option>德语</option>
                                <option>西班牙语</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">输出选项</label>
                            <div class="space-y-2">
                                <label class="flex items-center space-x-2 text-sm text-gray-300">
                                    <input type="checkbox" class="rounded bg-slate-700 border-slate-600" checked>
                                    <span>生成翻译字幕</span>
                                </label>
                                <label class="flex items-center space-x-2 text-sm text-gray-300">
                                    <input type="checkbox" class="rounded bg-slate-700 border-slate-600">
                                    <span>保留原语言字幕</span>
                                </label>
                                <label class="flex items-center space-x-2 text-sm text-gray-300">
                                    <input type="checkbox" class="rounded bg-slate-700 border-slate-600">
                                    <span>生成文本文件</span>
                                </label>
                            </div>
                        </div>
                    </div>
                `;
            
            case 'voiceClone':
                return `
                    <div class="space-y-6">
                        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-exclamation-triangle text-yellow-400 mt-1"></i>
                                <div class="text-sm text-yellow-200">
                                    <div class="font-semibold mb-1">音频要求</div>
                                    <ul class="space-y-1 text-xs">
                                        <li>• 音频长度：15-20秒（推荐）</li>
                                        <li>• 音质要求：清晰、无背景音乐、环境安静</li>
                                        <li>• 支持格式：wav、mp3、aac、m4a、wma、asf</li>
                                        <li>• 文件大小：不超过5MB</li>
                                        <li>• 采样率：16K、24K、48K</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-shield-alt text-red-400 mt-1"></i>
                                <div class="text-sm text-red-200">
                                    <div class="font-semibold mb-2">免责声明和使用条款</div>
                                    <ul class="space-y-1 text-xs mb-3">
                                        <li>• 仅限个人非商业用途，或已获授权的商业用途</li>
                                        <li>• 不得用于生成违法违规内容</li>
                                        <li>• 不支持克隆名人或公众人物声音（除非获得授权）</li>
                                        <li>• 使用者需承担相应的法律责任</li>
                                    </ul>
                                    <div class="flex items-center space-x-2">
                                        <input type="checkbox" id="disclaimer" class="rounded bg-slate-700 border-slate-600">
                                        <label for="disclaimer" class="text-xs cursor-pointer">我已阅读并同意以上条款</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            
            case 'digitalHuman':
                return `
                    <div class="space-y-6">
                        <div class="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-info-circle text-cyan-400 mt-1"></i>
                                <div class="text-sm text-cyan-200">
                                    <div class="font-semibold mb-1">功能说明</div>
                                    <ul class="space-y-1 text-xs">
                                        <li>• 上传5～120秒视频素材作为数智人形象</li>
                                        <li>• 输入文本内容或上传语音文件</li>
                                        <li>• 选择克隆声音或使用默认AI声音</li>
                                        <li>• 快速生成个性化数智人视频</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">内容类型</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-blue-600 text-white text-sm py-3 px-4 rounded-lg text-left">
                                    <div class="font-semibold">📝 文本播报</div>
                                    <div class="text-xs text-blue-200">输入文字，AI自动合成语音</div>
                                </button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-3 px-4 rounded-lg hover:bg-slate-600 text-left">
                                    <div class="font-semibold">🎵 语音文件</div>
                                    <div class="text-xs text-gray-400">上传音频文件作为播报内容</div>
                                </button>
                            </div>
                        </div>
                        
                        <div id="textInput" class="space-y-3">
                            <label class="block text-sm font-medium text-gray-300">播报文本</label>
                            <textarea 
                                placeholder="请输入需要数智人播报的文字内容..."
                                class="w-full h-24 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm resize-none"
                                maxlength="500"
                            ></textarea>
                            <div class="text-xs text-gray-400 text-right">0/500 字</div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">声音选择</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-green-600 text-white text-sm py-3 px-4 rounded-lg text-left">
                                    <div class="font-semibold">🎭 使用克隆声音</div>
                                    <div class="text-xs text-green-200">使用已保存的克隆声音</div>
                                </button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-3 px-4 rounded-lg hover:bg-slate-600 text-left">
                                    <div class="font-semibold">🤖 AI默认声音</div>
                                    <div class="text-xs text-gray-400">系统提供的标准AI声音</div>
                                </button>
                            </div>
                        </div>
                        
                        <div id="clonedVoices" class="bg-slate-700 rounded-lg p-4">
                            <div class="text-sm font-medium text-gray-300 mb-3">我的克隆声音</div>
                            <div class="space-y-2">
                                <div class="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                                    <div class="flex items-center space-x-3">
                                        <input type="radio" name="voice" class="text-blue-600">
                                        <div>
                                            <div class="text-white font-medium">商务演讲</div>
                                            <div class="text-xs text-gray-400">创建于 2024-12-01</div>
                                        </div>
                                    </div>
                                    <button class="text-blue-400 hover:text-blue-300 text-xs">
                                        <i class="fas fa-play mr-1"></i>试听
                                    </button>
                                </div>
                                <div class="flex items-center justify-between p-3 bg-slate-600 rounded-lg">
                                    <div class="flex items-center space-x-3">
                                        <input type="radio" name="voice" class="text-blue-600">
                                        <div>
                                            <div class="text-white font-medium">温柔解说</div>
                                            <div class="text-xs text-gray-400">创建于 2024-11-28</div>
                                        </div>
                                    </div>
                                    <button class="text-blue-400 hover:text-blue-300 text-xs">
                                        <i class="fas fa-play mr-1"></i>试听
                                    </button>
                                </div>
                                <div class="text-center pt-2">
                                    <a href="#" class="text-blue-400 hover:text-blue-300 text-sm">
                                        <i class="fas fa-plus mr-1"></i>创建新的克隆声音
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-3">生成质量</label>
                            <div class="grid grid-cols-1 gap-2">
                                <button class="bg-purple-600 text-white text-sm py-3 px-4 rounded-lg text-left">
                                    <div class="font-semibold">高质量</div>
                                    <div class="text-xs text-purple-200">1080p输出，更逼真效果</div>
                                </button>
                                <button class="bg-slate-700 text-gray-300 text-sm py-3 px-4 rounded-lg hover:bg-slate-600 text-left">
                                    <div class="font-semibold">标准质量</div>
                                    <div class="text-xs text-gray-400">720p输出，快速生成</div>
                                </button>
                            </div>
                        </div>
                        
                        <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-lightbulb text-yellow-400 mt-1"></i>
                                <div class="text-sm text-yellow-200">
                                    <div class="font-semibold mb-1">使用提示</div>
                                    <ul class="space-y-1 text-xs">
                                        <li>• 人物正面清晰的视频效果最佳</li>
                                        <li>• 建议文本内容控制在300字以内</li>
                                        <li>• 生成时间约3-5分钟</li>
                                        <li>• 适用于短视频、营销、教学等场景</li>
                                    </ul>
                                </div>
                            </div>
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