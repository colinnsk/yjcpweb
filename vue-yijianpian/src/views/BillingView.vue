<template>
  <div class="billing-view">
    <!-- 页面标题栏 -->
    <div class="bg-dark-800/50 border-b border-dark-700">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-white">💰 消费记录</h1>
            <p class="text-gray-400 mt-2">查看您的黄豆消费明细和余额变动</p>
          </div>
          <el-button type="primary" @click="showRechargeDialog = true" class="btn-primary">
            ➕ 充值黄豆
          </el-button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 余额概览 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="card text-center">
          <div class="text-4xl font-bold text-yellow-400 mb-2">{{ userBalance }}</div>
          <div class="text-gray-300 text-sm mb-2">当前余额</div>
          <div class="text-xs text-gray-500">黄豆</div>
        </div>
        <div class="card text-center">
          <div class="text-4xl font-bold text-green-400 mb-2">{{ monthlyStats.recharge }}</div>
          <div class="text-gray-300 text-sm mb-2">本月充值</div>
          <div class="text-xs text-gray-500">黄豆</div>
        </div>
        <div class="card text-center">
          <div class="text-4xl font-bold text-blue-400 mb-2">{{ monthlyStats.consumption }}</div>
          <div class="text-gray-300 text-sm mb-2">本月消费</div>
          <div class="text-xs text-gray-500">黄豆</div>
        </div>
      </div>

      <!-- 消费趋势图表 -->
      <div class="card mb-8">
        <h2 class="text-xl font-bold text-white mb-6">📊 消费趋势</h2>
        <div class="h-64 bg-dark-700 rounded-lg flex items-center justify-center">
          <div class="text-center">
            <div class="text-4xl mb-4">📈</div>
            <p class="text-gray-400">消费趋势图表</p>
            <p class="text-xs text-gray-500 mt-2">功能开发中...</p>
          </div>
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="card mb-8">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <el-input
              v-model="searchQuery"
              placeholder="搜索交易记录..."
              clearable
            >
              <template #prefix>
                <span>🔍</span>
              </template>
            </el-input>
          </div>
          <div class="flex gap-4">
            <el-select v-model="typeFilter" placeholder="交易类型" clearable>
              <el-option label="全部类型" value="" />
              <el-option label="消费" value="consumption" />
              <el-option label="充值" value="recharge" />
              <el-option label="退款" value="refund" />
            </el-select>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </div>
        </div>
      </div>

      <!-- 交易记录列表 -->
      <div class="card">
        <h2 class="text-xl font-bold text-white mb-6">💳 交易记录</h2>
        
        <div v-if="filteredRecords.length > 0" class="space-y-4">
          <div 
            v-for="record in filteredRecords" 
            :key="record.id" 
            class="bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <!-- 交易类型图标 -->
                <div class="mr-4">
                  <div v-if="record.type === 'consumption'" class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <span class="text-white">💰</span>
                  </div>
                  <div v-else-if="record.type === 'recharge'" class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span class="text-white">➕</span>
                  </div>
                  <div v-else-if="record.type === 'refund'" class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span class="text-white">↩️</span>
                  </div>
                </div>

                <!-- 交易信息 -->
                <div class="flex-1">
                  <div class="flex items-center mb-2">
                    <h3 class="font-semibold text-white mr-3">{{ record.description }}</h3>
                    <span 
                      class="transaction-badge" 
                      :class="getTransactionTypeColor(record.type)"
                    >
                      {{ getTransactionTypeName(record.type) }}
                    </span>
                  </div>
                  <div class="flex items-center text-sm text-gray-400 space-x-4">
                    <span>📅 {{ formatDateTime(record.createdAt) }}</span>
                    <span v-if="record.taskId">🎬 任务ID: {{ record.taskId }}</span>
                    <span v-if="record.orderId">📦 订单ID: {{ record.orderId }}</span>
                  </div>
                </div>
              </div>

              <!-- 金额显示 -->
              <div class="text-right">
                <div 
                  class="text-lg font-bold" 
                  :class="record.type === 'consumption' ? 'text-red-400' : 'text-green-400'"
                >
                  {{ record.type === 'consumption' ? '-' : '+' }}{{ record.amount }} 黄豆
                </div>
                <div class="text-sm text-gray-400">
                  余额: {{ record.balanceAfter }} 黄豆
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-12">
          <div class="text-6xl mb-4">💰</div>
          <h3 class="text-xl font-semibold text-white mb-2">
            {{ searchQuery || typeFilter || dateRange ? '没有找到匹配的记录' : '暂无交易记录' }}
          </h3>
          <p class="text-gray-400">
            {{ searchQuery || typeFilter || dateRange ? '尝试调整筛选条件' : '您还没有任何交易记录' }}
          </p>
        </div>
      </div>
    </div>

    <!-- 充值弹窗 -->
    <el-dialog
      v-model="showRechargeDialog"
      title="充值黄豆"
      width="500px"
      class="recharge-dialog"
    >
      <div class="space-y-6">
        <div>
          <h3 class="text-lg font-semibold text-white mb-4">选择充值套餐</h3>
          <div class="grid grid-cols-2 gap-4">
            <div 
              v-for="package_ in rechargePackages" 
              :key="package_.id"
              class="recharge-package"
              :class="{ 'active': selectedPackage?.id === package_.id }"
              @click="selectedPackage = package_"
            >
              <div class="text-center">
                <div class="text-2xl font-bold text-yellow-400 mb-1">{{ package_.amount }}</div>
                <div class="text-xs text-gray-400 mb-2">黄豆</div>
                <div class="text-green-400 font-semibold">¥{{ package_.price }}</div>
                <div v-if="package_.bonus > 0" class="text-xs text-orange-400 mt-1">
                  赠送 {{ package_.bonus }} 黄豆
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedPackage">
          <h4 class="text-white font-semibold mb-2">充值详情</h4>
          <div class="bg-dark-700 rounded-lg p-4 text-sm space-y-2">
            <div class="flex justify-between">
              <span class="text-gray-400">充值金额:</span>
              <span class="text-white">¥{{ selectedPackage.price }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">获得黄豆:</span>
              <span class="text-yellow-400">{{ selectedPackage.amount }} 个</span>
            </div>
            <div v-if="selectedPackage.bonus > 0" class="flex justify-between">
              <span class="text-gray-400">赠送黄豆:</span>
              <span class="text-orange-400">{{ selectedPackage.bonus }} 个</span>
            </div>
            <div class="border-t border-dark-600 pt-2 mt-2">
              <div class="flex justify-between font-semibold">
                <span class="text-gray-400">总计获得:</span>
                <span class="text-green-400">{{ selectedPackage.amount + selectedPackage.bonus }} 黄豆</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 class="text-white font-semibold mb-2">支付方式</h4>
          <div class="grid grid-cols-3 gap-3">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id"
              class="payment-method"
              :class="{ 'active': selectedPayment === method.id }"
              @click="selectedPayment = method.id"
            >
              <div class="text-center">
                <div class="text-2xl mb-1">{{ method.icon }}</div>
                <div class="text-xs text-gray-300">{{ method.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="showRechargeDialog = false">取消</el-button>
          <el-button 
            type="primary" 
            :disabled="!selectedPackage || !selectedPayment"
            @click="confirmRecharge"
          >
            确认充值 ¥{{ selectedPackage?.price || 0 }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 响应式数据
const searchQuery = ref('')
const typeFilter = ref('')
const dateRange = ref<[string, string] | null>(null)
const showRechargeDialog = ref(false)
const selectedPackage = ref<any>(null)
const selectedPayment = ref('')

// 用户余额
const userBalance = ref(1580)

// 充值套餐
const rechargePackages = ref([
  { id: 1, amount: 100, price: 10, bonus: 0 },
  { id: 2, amount: 500, price: 48, bonus: 20 },
  { id: 3, amount: 1000, price: 88, bonus: 100 },
  { id: 4, amount: 2000, price: 168, bonus: 300 },
  { id: 5, amount: 5000, price: 388, bonus: 1000 },
  { id: 6, amount: 10000, price: 698, bonus: 3000 }
])

// 支付方式
const paymentMethods = ref([
  { id: 'wechat', name: '微信支付', icon: '💚' },
  { id: 'alipay', name: '支付宝', icon: '🔵' },
  { id: 'bank', name: '银行卡', icon: '🏦' }
])

// 模拟交易记录数据
const transactionRecords = ref([
  {
    id: '1',
    type: 'consumption',
    description: '去除字幕 - 营销视频_final.mp4',
    amount: 6,
    balanceAfter: 1574,
    createdAt: new Date('2024-06-30T10:35:00'),
    taskId: 'T001'
  },
  {
    id: '2',
    type: 'recharge',
    description: '充值黄豆',
    amount: 1000,
    balanceAfter: 1580,
    createdAt: new Date('2024-06-30T09:00:00'),
    orderId: 'O202406300001'
  },
  {
    id: '3',
    type: 'consumption',
    description: '去除水印 - 产品宣传片.mp4',
    amount: 8,
    balanceAfter: 572,
    createdAt: new Date('2024-06-29T16:20:00'),
    taskId: 'T002'
  },
  {
    id: '4',
    type: 'consumption',
    description: '声音克隆 - 语音样本',
    amount: 10,
    balanceAfter: 562,
    createdAt: new Date('2024-06-29T14:15:00'),
    taskId: 'T003'
  },
  {
    id: '5',
    type: 'recharge',
    description: '充值黄豆',
    amount: 500,
    balanceAfter: 572,
    createdAt: new Date('2024-06-29T09:30:00'),
    orderId: 'O202406290001'
  },
  {
    id: '6',
    type: 'refund',
    description: '任务失败退款 - 处理错误',
    amount: 5,
    balanceAfter: 77,
    createdAt: new Date('2024-06-28T11:45:00'),
    taskId: 'T004'
  }
])

// 计算属性
const monthlyStats = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  let recharge = 0
  let consumption = 0
  
  transactionRecords.value.forEach(record => {
    const recordDate = new Date(record.createdAt)
    if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
      if (record.type === 'recharge') {
        recharge += record.amount
      } else if (record.type === 'consumption') {
        consumption += record.amount
      }
    }
  })
  
  return { recharge, consumption }
})

const filteredRecords = computed(() => {
  return transactionRecords.value.filter(record => {
    const matchesSearch = !searchQuery.value || 
      record.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      record.taskId?.includes(searchQuery.value) ||
      record.orderId?.includes(searchQuery.value)
    
    const matchesType = !typeFilter.value || record.type === typeFilter.value
    
    let matchesDate = true
    if (dateRange.value && dateRange.value.length === 2) {
      const recordDate = new Date(record.createdAt).toISOString().split('T')[0]
      matchesDate = recordDate >= dateRange.value[0] && recordDate <= dateRange.value[1]
    }
    
    return matchesSearch && matchesType && matchesDate
  })
})

// 方法
const getTransactionTypeName = (type: string) => {
  const names = {
    consumption: '消费',
    recharge: '充值',
    refund: '退款'
  }
  return names[type as keyof typeof names] || type
}

const getTransactionTypeColor = (type: string) => {
  const colors = {
    consumption: 'bg-red-600',
    recharge: 'bg-green-600',
    refund: 'bg-blue-600'
  }
  return colors[type as keyof typeof colors] || 'bg-gray-600'
}

const formatDateTime = (date: Date) => {
  return date.toLocaleString('zh-CN')
}

const confirmRecharge = () => {
  if (!selectedPackage.value || !selectedPayment.value) return
  
  ElMessage.success(`充值请求已提交，将获得 ${selectedPackage.value.amount + selectedPackage.value.bonus} 黄豆`)
  
  // 模拟充值成功
  setTimeout(() => {
    const newRecord = {
      id: Date.now().toString(),
      type: 'recharge',
      description: '充值黄豆',
      amount: selectedPackage.value.amount + selectedPackage.value.bonus,
      balanceAfter: userBalance.value + selectedPackage.value.amount + selectedPackage.value.bonus,
      createdAt: new Date(),
      orderId: `O${Date.now()}`
    }
    
    transactionRecords.value.unshift(newRecord)
    userBalance.value = newRecord.balanceAfter
    
    ElMessage.success('充值成功！')
    showRechargeDialog.value = false
    selectedPackage.value = null
    selectedPayment.value = ''
  }, 2000)
}
</script>

<style scoped>
.transaction-badge {
  @apply px-2 py-1 rounded text-xs font-medium text-white;
}

.recharge-package {
  @apply bg-dark-700 hover:bg-dark-600 rounded-lg p-4 cursor-pointer transition-all duration-200 border-2 border-transparent;
}

.recharge-package.active {
  @apply border-yellow-500 bg-yellow-900/20;
}

.payment-method {
  @apply bg-dark-700 hover:bg-dark-600 rounded-lg p-3 cursor-pointer transition-all duration-200 border-2 border-transparent;
}

.payment-method.active {
  @apply border-blue-500 bg-blue-900/20;
}

.recharge-dialog :deep(.el-dialog) {
  @apply bg-dark-800 border border-dark-700;
}

.recharge-dialog :deep(.el-dialog__title) {
  @apply text-white;
}
</style> 