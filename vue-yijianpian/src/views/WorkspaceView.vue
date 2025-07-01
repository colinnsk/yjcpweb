<template>
  <div class="workspace-view">
    <!-- 页面标题栏 -->
    <div class="bg-dark-800/50 border-b border-dark-700">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <h1 class="text-3xl font-bold text-white">
            🎬 视频处理工作台
          </h1>
          <div class="text-green-400 font-semibold text-sm bg-green-900/20 px-4 py-2 rounded-lg border border-green-500/30">
            🎁 免费试用: 1分钟
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- MVP说明横幅 -->
      <div class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-6 mb-8">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-white mb-2">🎬 视频原子能力处理中心</h2>
          <p class="text-gray-300 text-sm">选择所需的视频处理能力，简单上传，AI自动处理，快速获得结果</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- 左侧：能力选择面板 -->
        <div class="lg:col-span-1">
          <div class="card">
            <h2 class="text-xl font-bold text-white mb-6">
              <span class="text-blue-400">步骤 1:</span> 选择处理能力
            </h2>
            
            <!-- 智能去除能力 -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">智能去除</h3>
              <div class="space-y-2">
                <div 
                  v-for="capability in removeCapabilities" 
                  :key="capability.id"
                  class="capability-card"
                  :class="{ 'active': selectedCapability === capability.id }"
                  @click="selectCapability(capability.id)"
                >
                  <div class="flex items-center">
                    <div class="capability-icon" :class="`bg-gradient-to-r ${capability.color}`">
                      <span class="text-sm">{{ getCapabilityIcon(capability.icon) }}</span>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-white text-sm">{{ capability.name }}</h4>
                      <p class="text-xs text-gray-300">{{ capability.price }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- AI创作能力 -->
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">AI创作</h3>
              <div class="space-y-2">
                <div 
                  v-for="capability in createCapabilities" 
                  :key="capability.id"
                  class="capability-card"
                  :class="{ 'active': selectedCapability === capability.id }"
                  @click="selectCapability(capability.id)"
                >
                  <div class="flex items-center">
                    <div class="capability-icon" :class="`bg-gradient-to-r ${capability.color}`">
                      <span class="text-sm">{{ getCapabilityIcon(capability.icon) }}</span>
                    </div>
                    <div class="flex-1">
                      <h4 class="font-semibold text-white text-sm">{{ capability.name }}</h4>
                      <p class="text-xs text-gray-300">{{ capability.price }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 当前选择显示 -->
            <div class="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
              <h4 class="font-semibold text-white mb-2">
                <span class="text-blue-400">当前选择:</span>
              </h4>
              <div class="text-sm text-gray-300">
                <p class="font-medium text-white">{{ getCurrentCapability()?.name }}</p>
                <p class="text-blue-400">{{ getCurrentCapability()?.price }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：处理区域 -->
        <div class="lg:col-span-3">
          <div class="card">
            <h2 class="text-xl font-bold text-white mb-6">
              <span class="text-blue-400">步骤 2:</span> 上传文件并处理
            </h2>

            <!-- 文件上传区域 -->
            <div v-if="!uploadedFile" class="mb-8">
              <div 
                class="upload-zone"
                :class="{ 'dragover': isDragging }"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleFileDrop"
                @click="triggerFileInput"
              >
                <input 
                  ref="fileInput"
                  type="file"
                  class="hidden"
                  :accept="getAcceptedTypes()"
                  @change="handleFileSelect"
                >
                <div class="text-center">
                  <div class="text-6xl mb-4">📁</div>
                  <h3 class="text-xl font-semibold text-white mb-2">拖拽文件到此处或点击选择</h3>
                  <p class="text-gray-400 mb-4">{{ getFileTypeHint() }}</p>
                  <p class="text-sm text-gray-500">最大文件大小: {{ getCurrentCapability()?.maxFileSize }}MB</p>
                </div>
              </div>
            </div>

            <!-- 文件信息显示 -->
            <div v-if="uploadedFile" class="mb-8">
              <div class="bg-dark-700 rounded-lg p-4 flex items-center justify-between">
                <div class="flex items-center">
                  <div class="text-2xl mr-3">📎</div>
                  <div>
                    <h4 class="font-semibold text-white">{{ uploadedFile.name }}</h4>
                    <p class="text-sm text-gray-400">{{ formatFileSize(uploadedFile.size) }}</p>
                  </div>
                </div>
                <button 
                  @click="removeFile"
                  class="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <span class="text-xl">🗑️</span>
                </button>
              </div>
            </div>

            <!-- 费用预估 -->
            <div v-if="uploadedFile" class="mb-8">
              <div class="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <h4 class="font-semibold text-yellow-400 mb-2">💰 费用预估</h4>
                <div class="text-sm text-gray-300">
                  <p>处理能力: {{ getCurrentCapability()?.name }}</p>
                  <p>预估费用: <span class="text-yellow-400 font-semibold">{{ estimatedCost }} 黄豆</span></p>
                  <p class="text-xs text-gray-400 mt-1">*实际费用以处理完成后为准</p>
                </div>
              </div>
            </div>

            <!-- 处理按钮 -->
            <div v-if="uploadedFile && !isProcessing" class="mb-8">
              <el-button 
                type="primary" 
                size="large" 
                @click="startProcessing"
                class="w-full btn-primary"
              >
                🚀 开始处理视频
              </el-button>
            </div>

            <!-- 处理进度 -->
            <div v-if="isProcessing" class="mb-8">
              <div class="bg-dark-700 rounded-lg p-6">
                <h4 class="font-semibold text-white mb-4">⚡ 正在处理中...</h4>
                <div class="mb-4">
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-300">处理进度</span>
                    <span class="text-blue-400">{{ Math.round(processingProgress) }}%</span>
                  </div>
                  <div class="w-full bg-dark-600 rounded-full h-2">
                    <div 
                      class="progress-bar h-2 rounded-full transition-all duration-300"
                      :style="{ width: processingProgress + '%' }"
                    ></div>
                  </div>
                </div>
                <p class="text-sm text-gray-400">{{ processingStatus }}</p>
              </div>
            </div>

            <!-- 处理结果 -->
            <div v-if="processingResult" class="mb-8">
              <div class="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                <h4 class="font-semibold text-green-400 mb-4">✅ 处理完成</h4>
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-white font-medium">{{ processingResult.fileName }}</p>
                    <p class="text-sm text-gray-400">处理时间: {{ processingResult.duration }}s | 消费: {{ processingResult.cost }} 黄豆</p>
                  </div>
                  <el-button type="success" @click="downloadResult">
                    💾 下载结果
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { capabilities } from '@/config/capabilities'
import type { CapabilityType } from '@/types'

const route = useRoute()

// 响应式数据
const selectedCapability = ref<CapabilityType>('removeSubtitle')
const uploadedFile = ref<File | null>(null)
const isProcessing = ref(false)
const processingProgress = ref(0)
const processingStatus = ref('')
const isDragging = ref(false)
const processingResult = ref<any>(null)
const fileInput = ref<HTMLInputElement>()

// 计算属性
const removeCapabilities = computed(() => 
  Object.values(capabilities).filter(cap => cap.category === 'remove')
)

const createCapabilities = computed(() => 
  Object.values(capabilities).filter(cap => cap.category === 'create')
)

const estimatedCost = computed(() => {
  if (!uploadedFile.value) return 0
  const capability = getCurrentCapability()
  if (!capability) return 0
  
  if (capability.isPerUse) {
    return capability.pricePerMinute
  } else {
    // 估算视频时长 (简单估算: 1MB ≈ 10秒)
    const estimatedDuration = uploadedFile.value.size / (1024 * 1024) * 10
    return Math.ceil(estimatedDuration / 60) * capability.pricePerMinute
  }
})

// 方法
const getCurrentCapability = () => {
  return capabilities[selectedCapability.value]
}

const selectCapability = (capabilityId: CapabilityType) => {
  selectedCapability.value = capabilityId
  // 清除已上传文件，因为不同能力支持的文件类型可能不同
  uploadedFile.value = null
  processingResult.value = null
}

const getCapabilityIcon = (iconName: string) => {
  const iconMap: Record<string, string> = {
    'text-slash': '📝',
    'droplet-slash': '💧',
    'ban': '🚫',
    'file-text': '📄',
    'language': '🌐',
    'microphone-alt': '🎤',
    'user-astronaut': '🧑‍🚀'
  }
  return iconMap[iconName] || '⚙️'
}

const getAcceptedTypes = () => {
  const capability = getCurrentCapability()
  return capability?.supportedFormats.join(',') || ''
}

const getFileTypeHint = () => {
  const capability = getCurrentCapability()
  if (!capability) return ''
  
  const formats = capability.supportedFormats.map(format => format.split('/')[1]).join(', ')
  return `支持格式: ${formats}`
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    handleFile(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  isDragging.value = false
  const file = event.dataTransfer?.files[0]
  if (file) {
    handleFile(file)
  }
}

const handleFile = (file: File) => {
  const capability = getCurrentCapability()
  if (!capability) return

  // 验证文件类型
  if (!capability.supportedFormats.includes(file.type)) {
    alert(`不支持的文件格式，请选择: ${capability.supportedFormats.join(', ')}`)
    return
  }

  // 验证文件大小
  const maxSize = capability.maxFileSize * 1024 * 1024
  if (file.size > maxSize) {
    alert(`文件大小超过限制，最大支持 ${capability.maxFileSize}MB`)
    return
  }

  uploadedFile.value = file
  processingResult.value = null
}

const removeFile = () => {
  uploadedFile.value = null
  processingResult.value = null
}

const formatFileSize = (bytes: number) => {
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

const startProcessing = async () => {
  if (!uploadedFile.value) return

  isProcessing.value = true
  processingProgress.value = 0
  processingStatus.value = '正在上传文件...'

  // 模拟处理过程
  const steps = [
    { progress: 20, status: '文件上传完成，开始AI分析...' },
    { progress: 40, status: '正在识别处理目标...' },
    { progress: 60, status: '正在应用AI算法...' },
    { progress: 80, status: '正在优化处理结果...' },
    { progress: 100, status: '处理完成！' }
  ]

  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    processingProgress.value = step.progress
    processingStatus.value = step.status
  }

  // 生成处理结果
  processingResult.value = {
    fileName: `processed_${uploadedFile.value.name}`,
    duration: Math.floor(Math.random() * 30) + 10,
    cost: estimatedCost.value,
    downloadUrl: '#'
  }

  isProcessing.value = false
}

const downloadResult = () => {
  alert('下载功能演示：实际项目中这里会下载处理后的文件')
}

// 初始化
onMounted(() => {
  // 检查URL参数，设置默认选择的能力
  const capabilityParam = route.query.capability as CapabilityType
  if (capabilityParam && capabilities[capabilityParam]) {
    selectedCapability.value = capabilityParam
  }
})
</script>

<style scoped>
.capability-card {
  @apply bg-dark-700 hover:bg-dark-600 rounded-lg p-3 cursor-pointer transition-all duration-200;
}

.capability-card.active {
  @apply bg-blue-600/20 border border-blue-500/50;
}

.capability-icon {
  @apply w-10 h-10 rounded-lg flex items-center justify-center text-white mr-3;
}

.upload-zone {
  @apply border-2 border-dashed border-dark-600 rounded-xl p-12 text-center transition-all duration-300 cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5;
}

.upload-zone.dragover {
  @apply border-blue-500 bg-blue-500/10;
}
</style> 