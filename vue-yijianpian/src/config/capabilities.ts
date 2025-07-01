import type { Capability } from '@/types'

// 视频处理能力配置
export const capabilities: Record<string, Capability> = {
  removeSubtitle: {
    id: 'removeSubtitle',
    name: '去除字幕',
    description: 'AI智能识别视频中的字幕文字，精准去除不同样式的字幕内容，保持视频画面完整性。',
    icon: 'text-slash',
    price: '¥2/分钟',
    pricePerMinute: 2,
    color: 'from-blue-500 to-blue-600',
    category: 'remove',
    supportedFormats: ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/wmv'],
    maxFileSize: 500, // MB
    features: [
      '支持多种字幕样式识别',
      '背景修复算法',
      '保持视频质量',
      '批量处理支持'
    ]
  },

  removeWatermark: {
    id: 'removeWatermark',
    name: '去除水印',
    description: '智能检测和去除视频中的水印标识，支持透明水印、角标水印等多种类型。',
    icon: 'droplet-slash',
    price: '¥2.5/分钟',
    pricePerMinute: 2.5,
    color: 'from-green-500 to-green-600',
    category: 'remove',
    supportedFormats: ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/wmv'],
    maxFileSize: 500,
    features: [
      '透明水印检测',
      '角标水印去除',
      '动态水印处理',
      '边缘融合算法'
    ]
  },

  removeLogo: {
    id: 'removeLogo',
    name: '去除Logo',
    description: '精准识别并去除视频中的品牌Logo、台标等图形标识，保持视频内容纯净。',
    icon: 'ban',
    price: '¥2/分钟',
    pricePerMinute: 2,
    color: 'from-purple-500 to-purple-600',
    category: 'remove',
    supportedFormats: ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/wmv'],
    maxFileSize: 500,
    features: [
      'Logo形状识别',
      '背景重建',
      '色彩匹配',
      '固定和移动Logo支持'
    ]
  },

  textExtract: {
    id: 'textExtract',
    name: '视频文案提取',
    description: '自动识别视频中的语音内容，转换为可编辑的文字稿，支持多语言识别和时间戳标注。',
    icon: 'file-text',
    price: '¥1.5/分钟',
    pricePerMinute: 1.5,
    color: 'from-indigo-500 to-indigo-600',
    category: 'content',
    supportedFormats: ['video/mp4', 'video/avi', 'video/mov', 'audio/mp3', 'audio/wav'],
    maxFileSize: 300,
    features: [
      '多语言语音识别',
      '时间戳标注',
      '标点符号智能添加',
      '文字稿格式导出'
    ]
  },

  translate: {
    id: 'translate',
    name: '视频翻译',
    description: '智能识别视频语音，将其翻译成目标语言并生成对应字幕，支持30+语言互译。',
    icon: 'language',
    price: '¥3/分钟',
    pricePerMinute: 3,
    color: 'from-orange-500 to-orange-600',
    category: 'content',
    supportedFormats: ['video/mp4', 'video/avi', 'video/mov', 'audio/mp3', 'audio/wav'],
    maxFileSize: 300,
    features: [
      '30+语言支持',
      '语音识别+机器翻译',
      '字幕格式生成',
      '双语对照输出'
    ]
  },

  voiceClone: {
    id: 'voiceClone',
    name: '声音克隆',
    description: '通过用户上传的音频样本，克隆生成个性化声音，仅限用于数智人视频的语音合成。',
    icon: 'microphone-alt',
    price: '¥10/次',
    pricePerMinute: 10,
    color: 'from-pink-500 to-pink-600',
    category: 'create',
    isPerUse: true,
    supportedFormats: ['audio/wav', 'audio/mp3', 'audio/aac', 'audio/m4a', 'audio/wma'],
    maxFileSize: 5,
    features: [
      '15-20秒音频样本',
      '声音特征提取',
      '个性化声音模型',
      '数智人专用'
    ]
  },

  digitalHuman: {
    id: 'digitalHuman',
    name: '数智人生成',
    description: '无需训练，用户输入视频素材和文本/语音内容，快速生成数智人视频。',
    icon: 'user-astronaut',
    price: '¥15/次',
    pricePerMinute: 15,
    color: 'from-cyan-500 to-blue-600',
    category: 'create',
    isPerUse: true,
    supportedFormats: ['video/mp4', 'video/avi', 'video/mov', 'audio/mp3', 'audio/wav'],
    maxFileSize: 200,
    features: [
      '5-120秒视频素材',
      '文字/音频内容合成',
      '声音选择',
      '唇形同步'
    ]
  }
}

// 按类别分组的能力
export const capabilitiesByCategory = {
  remove: [capabilities.removeSubtitle, capabilities.removeWatermark, capabilities.removeLogo],
  content: [capabilities.textExtract, capabilities.translate],
  create: [capabilities.voiceClone, capabilities.digitalHuman]
}

// 能力类别信息
export const categoryInfo = {
  remove: {
    name: '智能去除',
    description: '核心功能',
    icon: 'eraser',
    color: 'text-blue-400'
  },
  content: {
    name: '内容处理',
    description: '智能辅助',
    icon: 'file-alt',
    color: 'text-indigo-400'
  },
  create: {
    name: 'AI创作',
    description: '创新功能',
    icon: 'magic',
    color: 'text-pink-400'
  }
}

// 支持的文件格式映射
export const fileTypeMap = {
  video: ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/wmv'],
  audio: ['audio/mp3', 'audio/wav', 'audio/aac', 'audio/m4a', 'audio/wma']
}

// 获取能力的文件类型要求
export const getFileTypeRequirement = (capabilityId: string): string[] => {
  const capability = capabilities[capabilityId]
  return capability?.supportedFormats || []
}

// 验证文件是否符合能力要求
export const validateFileForCapability = (file: File, capabilityId: string) => {
  const capability = capabilities[capabilityId]
  if (!capability) return { valid: false, message: '未知的处理能力' }

  // 检查文件类型
  if (!capability.supportedFormats.includes(file.type)) {
    return {
      valid: false,
      message: `不支持的文件格式，请选择：${capability.supportedFormats.join(', ')}`
    }
  }

  // 检查文件大小
  const maxSize = capability.maxFileSize * 1024 * 1024 // 转换为字节
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `文件大小超过限制，最大支持 ${capability.maxFileSize}MB`
    }
  }

  return { valid: true, message: '文件验证通过' }
} 