<template>
  <div class="tasks-view">
    <!-- 页面标题栏 -->
    <div class="bg-dark-800/50 border-b border-dark-700">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-white">📋 任务管理</h1>
            <p class="text-gray-400 mt-2">查看和管理您的视频处理任务</p>
          </div>
          <router-link 
            to="/workspace" 
            class="btn-primary"
          >
            ➕ 新建任务
          </router-link>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card text-center">
          <div class="text-3xl font-bold text-blue-400 mb-2">{{ taskStats.total }}</div>
          <div class="text-gray-300 text-sm">总任务数</div>
        </div>
        <div class="card text-center">
          <div class="text-3xl font-bold text-yellow-400 mb-2">{{ taskStats.processing }}</div>
          <div class="text-gray-300 text-sm">处理中</div>
        </div>
        <div class="card text-center">
          <div class="text-3xl font-bold text-green-400 mb-2">{{ taskStats.completed }}</div>
          <div class="text-gray-300 text-sm">已完成</div>
        </div>
        <div class="card text-center">
          <div class="text-3xl font-bold text-red-400 mb-2">{{ taskStats.failed }}</div>
          <div class="text-gray-300 text-sm">失败</div>
        </div>
      </div>

      <!-- 筛选和搜索 -->
      <div class="card mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <el-input
              v-model="searchQuery"
              placeholder="搜索任务..."
              clearable
              class="w-full"
            >
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
          </div>
          <div class="flex gap-4">
            <el-select v-model="statusFilter" placeholder="状态筛选" clearable>
              <el-option label="全部状态" value="" />
              <el-option label="等待中" value="pending" />
              <el-option label="处理中" value="processing" />
              <el-option label="已完成" value="completed" />
              <el-option label="失败" value="failed" />
            </el-select>
            <el-select v-model="capabilityFilter" placeholder="能力筛选" clearable>
              <el-option label="全部能力" value="" />
              <el-option label="去除字幕" value="removeSubtitle" />
              <el-option label="去除水印" value="removeWatermark" />
              <el-option label="去除Logo" value="removeLogo" />
              <el-option label="声音克隆" value="voiceClone" />
              <el-option label="数智人生成" value="digitalHuman" />
            </el-select>
          </div>
        </div>
      </div>

      <!-- 任务列表 -->
      <div v-if="filteredTasks.length > 0" class="space-y-4">
        <div 
          v-for="task in filteredTasks" 
          :key="task.id" 
          class="card-hover"
          @click="showTaskDetail(task)"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center flex-1">
              <!-- 状态图标 -->
              <div class="mr-4">
                <div v-if="task.status === 'pending'" class="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div v-else-if="task.status === 'processing'" class="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <div v-else-if="task.status === 'completed'" class="w-3 h-3 bg-green-400 rounded-full"></div>
                <div v-else-if="task.status === 'failed'" class="w-3 h-3 bg-red-400 rounded-full"></div>
              </div>

              <!-- 任务信息 -->
              <div class="flex-1">
                <div class="flex items-center mb-2">
                  <h3 class="font-semibold text-white mr-3">{{ task.fileName }}</h3>
                  <span class="capability-badge" :class="getCapabilityColor(task.capability)">
                    {{ getCapabilityName(task.capability) }}
                  </span>
                </div>
                <div class="flex items-center text-sm text-gray-400 space-x-4">
                  <span>📅 {{ formatDate(task.createdAt) }}</span>
                  <span>⏱️ {{ task.duration || '-' }}</span>
                  <span>💰 {{ task.cost || 0 }} 黄豆</span>
                </div>
              </div>
            </div>

            <!-- 进度条（处理中时显示） -->
            <div v-if="task.status === 'processing'" class="w-32 mr-4">
              <div class="text-xs text-gray-400 mb-1">{{ task.progress }}%</div>
              <div class="w-full bg-dark-600 rounded-full h-2">
                <div 
                  class="progress-bar h-2 rounded-full transition-all duration-300"
                  :style="{ width: task.progress + '%' }"
                ></div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center space-x-2">
              <el-button 
                v-if="task.status === 'completed' && task.downloadUrl"
                type="success" 
                size="small" 
                @click.stop="downloadTask(task)"
              >
                💾 下载
              </el-button>
              <el-button 
                v-if="task.status === 'failed'"
                type="primary" 
                size="small" 
                @click.stop="retryTask(task)"
              >
                🔄 重试
              </el-button>
              <el-button 
                type="danger" 
                size="small" 
                @click.stop="deleteTask(task.id)"
              >
                🗑️ 删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="card">
        <div class="text-center py-12">
          <div class="text-6xl mb-4">📋</div>
          <h3 class="text-xl font-semibold text-white mb-2">
            {{ searchQuery || statusFilter || capabilityFilter ? '没有找到匹配的任务' : '暂无任务' }}
          </h3>
          <p class="text-gray-400 mb-6">
            {{ searchQuery || statusFilter || capabilityFilter ? '尝试调整筛选条件' : '您还没有创建任何视频处理任务' }}
          </p>
          <router-link 
            to="/workspace" 
            class="btn-primary"
          >
            开始处理视频
          </router-link>
        </div>
      </div>
    </div>

    <!-- 任务详情弹窗 -->
    <el-dialog
      v-model="showDetailDialog"
      title="任务详情"
      width="600px"
      class="task-detail-dialog"
    >
      <div v-if="selectedTask" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-white">{{ selectedTask.fileName }}</h3>
          <span class="status-badge" :class="getStatusColor(selectedTask.status)">
            {{ getStatusText(selectedTask.status) }}
          </span>
        </div>
        
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-400">处理能力:</span>
            <span class="text-white ml-2">{{ getCapabilityName(selectedTask.capability) }}</span>
          </div>
          <div>
            <span class="text-gray-400">文件大小:</span>
            <span class="text-white ml-2">{{ formatFileSize(selectedTask.fileSize) }}</span>
          </div>
          <div>
            <span class="text-gray-400">创建时间:</span>
            <span class="text-white ml-2">{{ formatDate(selectedTask.createdAt) }}</span>
          </div>
          <div>
            <span class="text-gray-400">处理时长:</span>
            <span class="text-white ml-2">{{ selectedTask.duration || '-' }}</span>
          </div>
          <div>
            <span class="text-gray-400">消费金额:</span>
            <span class="text-white ml-2">{{ selectedTask.cost || 0 }} 黄豆</span>
          </div>
        </div>

        <div v-if="selectedTask.status === 'processing'" class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h4 class="font-semibold text-blue-400 mb-2">处理进度</h4>
          <div class="mb-2">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-300">进度</span>
              <span class="text-blue-400">{{ selectedTask.progress }}%</span>
            </div>
            <div class="w-full bg-dark-600 rounded-full h-2">
              <div 
                class="progress-bar h-2 rounded-full transition-all duration-300"
                :style="{ width: selectedTask.progress + '%' }"
              ></div>
            </div>
          </div>
          <p class="text-sm text-gray-400">{{ selectedTask.statusMessage || '正在处理中...' }}</p>
        </div>

        <div v-if="selectedTask.status === 'failed'" class="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <h4 class="font-semibold text-red-400 mb-2">错误信息</h4>
          <p class="text-sm text-gray-300">{{ selectedTask.errorMessage || '处理失败，请重试' }}</p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="showDetailDialog = false">关闭</el-button>
          <el-button 
            v-if="selectedTask?.status === 'completed' && selectedTask?.downloadUrl"
            type="success" 
            @click="downloadTask(selectedTask)"
          >
            💾 下载结果
          </el-button>
          <el-button 
            v-if="selectedTask?.status === 'failed'"
            type="primary" 
            @click="retryTask(selectedTask)"
          >
            🔄 重试任务
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { capabilities } from '@/config/capabilities'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式数据
const searchQuery = ref('')
const statusFilter = ref('')
const capabilityFilter = ref('')
const showDetailDialog = ref(false)
const selectedTask = ref<any>(null)

// 模拟任务数据
const tasks = ref([
  {
    id: '1',
    fileName: '营销视频_final.mp4',
    capability: 'removeSubtitle',
    status: 'completed',
    progress: 100,
    createdAt: new Date('2024-06-30T10:30:00'),
    duration: '2m 15s',
    cost: 6,
    fileSize: 25600000,
    downloadUrl: '#'
  },
  {
    id: '2', 
    fileName: '产品介绍.mov',
    capability: 'removeWatermark',
    status: 'processing',
    progress: 65,
    createdAt: new Date('2024-06-30T11:45:00'),
    duration: null,
    cost: null,
    fileSize: 45800000,
    statusMessage: '正在应用AI算法...'
  },
  {
    id: '3',
    fileName: '宣传片.mp4',
    capability: 'voiceClone',
    status: 'pending',
    progress: 0,
    createdAt: new Date('2024-06-30T12:00:00'),
    duration: null,
    cost: null,
    fileSize: 15600000
  },
  {
    id: '4',
    fileName: '教学视频.avi',
    capability: 'removeLogo',
    status: 'failed',
    progress: 0,
    createdAt: new Date('2024-06-30T09:15:00'),
    duration: null,
    cost: 0,
    fileSize: 67200000,
    errorMessage: '文件格式不支持，请使用MP4格式'
  }
])

// 计算属性
const taskStats = computed(() => {
  const stats = {
    total: tasks.value.length,
    processing: 0,
    completed: 0,
    failed: 0
  }
  
  tasks.value.forEach(task => {
    if (task.status === 'processing' || task.status === 'pending') {
      stats.processing++
    } else if (task.status === 'completed') {
      stats.completed++
    } else if (task.status === 'failed') {
      stats.failed++
    }
  })
  
  return stats
})

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {
    const matchesSearch = !searchQuery.value || 
      task.fileName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || task.status === statusFilter.value
    const matchesCapability = !capabilityFilter.value || task.capability === capabilityFilter.value
    
    return matchesSearch && matchesStatus && matchesCapability
  })
})

// 方法
const getCapabilityName = (capabilityId: string) => {
  return capabilities[capabilityId]?.name || capabilityId
}

const getCapabilityColor = (capabilityId: string) => {
  const capability = capabilities[capabilityId]
  if (!capability) return 'bg-gray-600'
  
  if (capability.category === 'remove') return 'bg-blue-600'
  if (capability.category === 'create') return 'bg-pink-600'
  return 'bg-indigo-600'
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'bg-yellow-600',
    processing: 'bg-blue-600',
    completed: 'bg-green-600',
    failed: 'bg-red-600'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-600'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: '等待中',
    processing: '处理中',
    completed: '已完成',
    failed: '失败'
  }
  return texts[status as keyof typeof texts] || status
}

const formatDate = (date: Date) => {
  return date.toLocaleString('zh-CN')
}

const formatFileSize = (bytes: number) => {
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const showTaskDetail = (task: any) => {
  selectedTask.value = task
  showDetailDialog.value = true
}

const downloadTask = (task: any) => {
  ElMessage.success(`开始下载: ${task.fileName}`)
  // 实际项目中这里会触发文件下载
}

const retryTask = async (task: any) => {
  try {
    await ElMessageBox.confirm('确定要重试这个任务吗？', '确认重试', {
      type: 'warning'
    })
    
    // 更新任务状态
    task.status = 'pending'
    task.progress = 0
    task.errorMessage = null
    
    ElMessage.success('任务已重新提交处理')
    showDetailDialog.value = false
  } catch {
    // 用户取消
  }
}

const deleteTask = async (taskId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个任务吗？删除后无法恢复。', '确认删除', {
      type: 'warning'
    })
    
    const index = tasks.value.findIndex(task => task.id === taskId)
    if (index > -1) {
      tasks.value.splice(index, 1)
      ElMessage.success('任务已删除')
    }
  } catch {
    // 用户取消
  }
}

// 模拟实时更新处理进度
onMounted(() => {
  const updateProgress = () => {
    tasks.value.forEach(task => {
      if (task.status === 'processing' && task.progress < 100) {
        task.progress = Math.min(100, task.progress + Math.random() * 5)
        if (task.progress >= 100) {
          task.status = 'completed'
          task.duration = `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 60)}s`
          task.cost = Math.ceil(Math.random() * 20) + 5
          task.downloadUrl = '#'
        }
      }
    })
  }
  
  const timer = setInterval(updateProgress, 2000)
  
  // 组件卸载时清除定时器
  return () => clearInterval(timer)
})
</script>

<style scoped>
.capability-badge {
  @apply px-2 py-1 rounded text-xs font-medium text-white;
}

.status-badge {
  @apply px-3 py-1 rounded-full text-xs font-medium text-white;
}

.task-detail-dialog :deep(.el-dialog) {
  @apply bg-dark-800 border border-dark-700;
}

.task-detail-dialog :deep(.el-dialog__title) {
  @apply text-white;
}
</style> 