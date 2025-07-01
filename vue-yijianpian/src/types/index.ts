// 视频处理能力类型
export type CapabilityType = 
  | 'removeSubtitle'
  | 'removeWatermark' 
  | 'removeLogo'
  | 'textExtract'
  | 'translate'
  | 'voiceClone'
  | 'digitalHuman'

// 能力配置接口
export interface Capability {
  id: CapabilityType
  name: string
  description: string
  icon: string
  price: string
  pricePerMinute: number
  color: string
  category: 'remove' | 'content' | 'create'
  isPerUse?: boolean // 是否按次收费
  supportedFormats: string[]
  maxFileSize: number // MB
  features: string[]
}

// 任务状态类型
export type TaskStatus = 
  | 'uploading'
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'

// 任务接口
export interface Task {
  id: string
  name: string
  capability: CapabilityType
  status: TaskStatus
  progress: number
  createdAt: string
  completedAt?: string
  fileSize: number
  duration?: number // 视频时长(秒)
  cost: number // 消费的黄豆数量
  originalFile: File
  resultUrl?: string
  errorMessage?: string
}

// 用户信息接口
export interface UserInfo {
  id: string
  name: string
  email: string
  avatar: string
  balance: number // 黄豆余额
  registerDate: string
  totalTasks: number
  totalSpent: number
}

// 消费记录接口
export interface BillingRecord {
  id: string
  type: 'consumption' | 'recharge'
  amount: number
  description: string
  taskId?: string
  createdAt: string
  balance: number // 操作后余额
}

// 通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

// 通知接口
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  createdAt: string
  isRead: boolean
}

// 文件上传状态
export interface UploadStatus {
  file: File | null
  isUploading: boolean
  progress: number
  error?: string
}

// 处理配置接口
export interface ProcessingConfig {
  capability: CapabilityType
  quality: 'standard' | 'high' | 'ultra'
  options: Record<string, any>
}

// API响应接口
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
}

// 分页接口
export interface Pagination {
  page: number
  pageSize: number
  total: number
}

// 筛选选项接口
export interface FilterOptions {
  status?: TaskStatus[]
  capability?: CapabilityType[]
  dateRange?: [string, string]
  keyword?: string
}

// 路由元信息接口
export interface RouteMeta extends Record<string, unknown> {
  title: string
  icon?: string
  requiresAuth?: boolean
  keepAlive?: boolean
}

// 导航项接口
export interface NavItem {
  id: string
  name: string
  icon: string
  path: string
  badge?: number
}

// 统计数据接口
export interface Statistics {
  totalTasks: number
  completedTasks: number
  totalSpent: number
  averageProcessTime: number
  successRate: number
} 