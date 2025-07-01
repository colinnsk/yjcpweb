<template>
  <div class="pricing-view">
    <!-- 页面标题栏 -->
    <div class="bg-dark-800/50 border-b border-dark-700">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-white">💎 套餐定价</h1>
          <p class="text-gray-400 mt-2">选择适合您的黄豆充值套餐，享受专业的AI视频处理服务</p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 计费方式选择 -->
      <div class="text-center mb-12">
        <div class="inline-flex bg-dark-800 rounded-lg p-1">
          <button 
            v-for="mode in billingModes" 
            :key="mode.id"
            class="billing-mode-btn"
            :class="{ 'active': selectedBillingMode === mode.id }"
            @click="selectedBillingMode = mode.id"
          >
            {{ mode.name }}
          </button>
        </div>
      </div>

      <!-- 按量付费套餐 -->
      <div v-if="selectedBillingMode === 'payAsYouGo'" class="space-y-12">
        <!-- 充值套餐 -->
        <section>
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-white mb-4">💰 充值套餐</h2>
            <p class="text-gray-400">一次充值，随时使用，按需消费</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="package_ in rechargePackages" 
              :key="package_.id"
              class="pricing-card"
              :class="{ 'popular': package_.popular, 'best-value': package_.bestValue }"
            >
              <div v-if="package_.popular" class="popular-badge">🔥 热门</div>
              <div v-if="package_.bestValue" class="best-value-badge">💎 最划算</div>
              
              <div class="text-center mb-6">
                <div class="text-4xl font-bold text-yellow-400 mb-2">{{ package_.amount }}</div>
                <div class="text-gray-400 text-sm mb-4">黄豆</div>
                <div class="text-3xl font-bold text-white mb-2">¥{{ package_.price }}</div>
                <div v-if="package_.bonus > 0" class="text-orange-400 text-sm">
                  赠送 {{ package_.bonus }} 黄豆
                </div>
              </div>

              <div class="space-y-3 mb-6">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-400">实际获得:</span>
                  <span class="text-green-400 font-semibold">{{ package_.amount + package_.bonus }} 黄豆</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-400">性价比:</span>
                  <span class="text-blue-400">{{ (package_.amount / package_.price).toFixed(1) }} 黄豆/元</span>
                </div>
                <div v-if="package_.bonus > 0" class="flex justify-between text-sm">
                  <span class="text-gray-400">赠送比例:</span>
                  <span class="text-orange-400">+{{ Math.round(package_.bonus / package_.amount * 100) }}%</span>
                </div>
              </div>

              <ul class="space-y-2 mb-6">
                <li v-for="feature in package_.features" :key="feature" class="flex items-center text-sm text-gray-300">
                  <span class="text-green-400 mr-2">✓</span>
                  {{ feature }}
                </li>
              </ul>

              <el-button 
                type="primary" 
                size="large" 
                class="w-full"
                :class="package_.popular ? 'btn-popular' : 'btn-primary'"
                @click="selectPackage(package_)"
              >
                立即购买
              </el-button>
            </div>
          </div>
        </section>

        <!-- 能力价格表 -->
        <section>
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-white mb-4">⚡ 能力价格表</h2>
            <p class="text-gray-400">透明定价，按实际使用量计费</p>
          </div>

          <div class="card">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-dark-700">
                    <th class="text-left py-4 px-4 text-white font-semibold">处理能力</th>
                    <th class="text-left py-4 px-4 text-white font-semibold">计费方式</th>
                    <th class="text-left py-4 px-4 text-white font-semibold">价格</th>
                    <th class="text-left py-4 px-4 text-white font-semibold">说明</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="capability in capabilityPricing" :key="capability.id" class="border-b border-dark-700/50">
                    <td class="py-4 px-4">
                      <div class="flex items-center">
                        <span class="text-2xl mr-3">{{ capability.icon }}</span>
                        <div>
                          <div class="text-white font-medium">{{ capability.name }}</div>
                          <div class="text-sm text-gray-400">{{ capability.category }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-4 text-gray-300">{{ capability.billingType }}</td>
                    <td class="py-4 px-4">
                      <span class="text-yellow-400 font-semibold">{{ capability.price }}</span>
                    </td>
                    <td class="py-4 px-4 text-gray-400 text-sm">{{ capability.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <!-- 会员套餐（开发中） -->
      <div v-else class="text-center py-20">
        <div class="card max-w-md mx-auto">
          <div class="text-6xl mb-4">🚧</div>
          <h2 class="text-2xl font-bold text-white mb-4">会员套餐开发中</h2>
          <p class="text-gray-400 mb-6">我们正在设计更优惠的会员套餐方案，敬请期待！</p>
          <p class="text-sm text-gray-500">预计上线时间：2024年8月</p>
        </div>
      </div>

      <!-- 常见问题 -->
      <section class="mt-16">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-4">❓ 常见问题</h2>
          <p class="text-gray-400">关于黄豆充值和使用的常见问题解答</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="faq in faqs" :key="faq.id" class="card">
            <h3 class="text-white font-semibold mb-3">{{ faq.question }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{{ faq.answer }}</p>
          </div>
        </div>
      </section>

      <!-- 优势特点 -->
      <section class="mt-16">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-4">🌟 为什么选择我们</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white text-2xl">⚡</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">极速处理</h3>
            <p class="text-gray-400">AI算法优化，处理速度提升5倍，节省您的宝贵时间</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white text-2xl">💎</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">专业品质</h3>
            <p class="text-gray-400">媲美专业软件的处理效果，无需复杂操作</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white text-2xl">🔒</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">隐私安全</h3>
            <p class="text-gray-400">文件加密传输，处理完自动删除，保护您的隐私</p>
          </div>
        </div>
      </section>
    </div>

    <!-- 购买确认弹窗 -->
    <el-dialog
      v-model="showPurchaseDialog"
      title="确认购买"
      width="500px"
      class="purchase-dialog"
    >
      <div v-if="selectedPackage" class="space-y-4">
        <div class="text-center mb-6">
          <div class="text-3xl font-bold text-yellow-400 mb-2">{{ selectedPackage.amount }} 黄豆</div>
          <div class="text-2xl font-bold text-white">¥{{ selectedPackage.price }}</div>
          <div v-if="selectedPackage.bonus > 0" class="text-orange-400 text-sm mt-1">
            赠送 {{ selectedPackage.bonus }} 黄豆
          </div>
        </div>

        <div class="bg-dark-700 rounded-lg p-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">套餐价格:</span>
            <span class="text-white">¥{{ selectedPackage.price }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-400">基础黄豆:</span>
            <span class="text-yellow-400">{{ selectedPackage.amount }} 个</span>
          </div>
          <div v-if="selectedPackage.bonus > 0" class="flex justify-between text-sm">
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

        <div>
          <h4 class="text-white font-semibold mb-3">选择支付方式</h4>
          <div class="grid grid-cols-3 gap-3">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id"
              class="payment-method-card"
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
          <el-button @click="showPurchaseDialog = false">取消</el-button>
          <el-button 
            type="primary" 
            :disabled="!selectedPayment"
            @click="confirmPurchase"
            class="btn-primary"
          >
            确认支付 ¥{{ selectedPackage?.price || 0 }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { capabilities } from '@/config/capabilities'

const router = useRouter()

// 响应式数据
const selectedBillingMode = ref('payAsYouGo')
const showPurchaseDialog = ref(false)
const selectedPackage = ref<any>(null)
const selectedPayment = ref('')

// 计费方式
const billingModes = [
  { id: 'payAsYouGo', name: '按量付费' },
  { id: 'subscription', name: '会员套餐' }
]

// 充值套餐
const rechargePackages = ref([
  {
    id: 1,
    amount: 100,
    price: 10,
    bonus: 0,
    popular: false,
    bestValue: false,
    features: [
      '适合轻度用户',
      '约可处理10-50个视频',
      '支持所有基础功能',
      '24小时内到账'
    ]
  },
  {
    id: 2,
    amount: 500,
    price: 48,
    bonus: 20,
    popular: true,
    bestValue: false,
    features: [
      '适合个人创作者',
      '约可处理250-500个视频',
      '赠送20黄豆',
      '优先处理队列',
      '邮件技术支持'
    ]
  },
  {
    id: 3,
    amount: 1000,
    price: 88,
    bonus: 100,
    popular: false,
    bestValue: true,
    features: [
      '适合专业用户',
      '约可处理500-1000个视频',
      '赠送100黄豆',
      '最高处理优先级',
      '专属客服支持',
      '批量处理折扣'
    ]
  },
  {
    id: 4,
    amount: 2000,
    price: 168,
    bonus: 300,
    popular: false,
    bestValue: false,
    features: [
      '适合团队使用',
      '约可处理1000-2000个视频',
      '赠送300黄豆',
      '企业级支持',
      'API调用优先',
      '定制化服务'
    ]
  },
  {
    id: 5,
    amount: 5000,
    price: 388,
    bonus: 1000,
    popular: false,
    bestValue: false,
    features: [
      '适合大型企业',
      '约可处理2500-5000个视频',
      '赠送1000黄豆',
      '专属技术经理',
      '私有化部署支持',
      '7x24小时服务'
    ]
  },
  {
    id: 6,
    amount: 10000,
    price: 698,
    bonus: 3000,
    popular: false,
    bestValue: false,
    features: [
      '大客户专享',
      '无限制使用',
      '赠送3000黄豆',
      '定制化功能开发',
      '本地化部署',
      '专属服务团队'
    ]
  }
])

// 支付方式
const paymentMethods = ref([
  { id: 'wechat', name: '微信支付', icon: '💚' },
  { id: 'alipay', name: '支付宝', icon: '🔵' },
  { id: 'bank', name: '银行卡', icon: '🏦' }
])

// 能力定价
const capabilityPricing = computed(() => [
  {
    id: 'removeSubtitle',
    name: '去除字幕',
    category: '智能去除',
    icon: '📝',
    billingType: '按分钟计费',
    price: '2 黄豆/分钟',
    description: '智能识别并去除视频中的字幕文字'
  },
  {
    id: 'removeWatermark',
    name: '去除水印',
    category: '智能去除',
    icon: '💧',
    billingType: '按分钟计费',
    price: '2.5 黄豆/分钟',
    description: '检测并去除各种类型的水印标识'
  },
  {
    id: 'removeLogo',
    name: '去除Logo',
    category: '智能去除',
    icon: '🚫',
    billingType: '按分钟计费',
    price: '2 黄豆/分钟',
    description: '精准识别并去除品牌Logo标识'
  },
  {
    id: 'voiceClone',
    name: '声音克隆',
    category: 'AI创作',
    icon: '🎤',
    billingType: '按次计费',
    price: '10 黄豆/次',
    description: '基于音频样本克隆个性化声音'
  },
  {
    id: 'digitalHuman',
    name: '数智人生成',
    category: 'AI创作',
    icon: '🧑‍🚀',
    billingType: '按次计费',
    price: '15 黄豆/次',
    description: '快速生成数智人视频内容'
  }
])

// 常见问题
const faqs = ref([
  {
    id: 1,
    question: '黄豆是什么？如何使用？',
    answer: '黄豆是我们平台的虚拟货币，用于支付视频处理服务。1个黄豆通常价值0.1元人民币，您可以通过充值获得黄豆，然后用于支付各种AI处理服务。'
  },
  {
    id: 2,
    question: '充值的黄豆有有效期吗？',
    answer: '充值的黄豆永久有效，没有过期时间限制。您可以随时使用账户中的黄豆来处理视频，未使用的黄豆会一直保留在您的账户中。'
  },
  {
    id: 3,
    question: '如何计算视频处理费用？',
    answer: '不同功能采用不同计费方式：去除类功能按视频时长计费（如2黄豆/分钟），创作类功能按次计费（如10黄豆/次）。具体费用在上传文件后会显示预估。'
  },
  {
    id: 4,
    question: '支持哪些支付方式？',
    answer: '我们支持微信支付、支付宝和银行卡支付。所有支付均通过安全的第三方支付平台处理，确保您的资金安全。'
  },
  {
    id: 5,
    question: '处理失败会退款吗？',
    answer: '如果由于我们系统问题导致处理失败，我们会自动将消费的黄豆退回到您的账户。如果是文件格式不支持等用户原因，则不予退款。'
  },
  {
    id: 6,
    question: '可以开具发票吗？',
    answer: '可以开具电子发票。在充值成功后，您可以在"个人中心-发票管理"中申请开具增值税普通发票，支持个人和企业抬头。'
  }
])

// 方法
const selectPackage = (package_: any) => {
  selectedPackage.value = package_
  selectedPayment.value = ''
  showPurchaseDialog.value = true
}

const confirmPurchase = () => {
  if (!selectedPayment.value || !selectedPackage.value) return
  
  ElMessage.success(`支付请求已提交，将获得 ${selectedPackage.value.amount + selectedPackage.value.bonus} 黄豆`)
  
  // 模拟支付成功后跳转
  setTimeout(() => {
    ElMessage.success('支付成功！黄豆已到账')
    showPurchaseDialog.value = false
    router.push('/billing')
  }, 2000)
}
</script>

<style scoped>
.billing-mode-btn {
  @apply px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 text-gray-400;
}

.billing-mode-btn.active {
  @apply bg-blue-600 text-white;
}

.pricing-card {
  @apply bg-dark-800/80 backdrop-blur-sm border border-dark-700 rounded-xl p-6 shadow-lg relative transition-all duration-300 hover:shadow-xl hover:scale-105;
}

.pricing-card.popular {
  @apply border-orange-500/50 shadow-orange-500/20;
}

.pricing-card.best-value {
  @apply border-green-500/50 shadow-green-500/20;
}

.popular-badge {
  @apply absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium;
}

.best-value-badge {
  @apply absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium;
}

.btn-popular {
  @apply bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white;
}

.payment-method-card {
  @apply bg-dark-700 hover:bg-dark-600 rounded-lg p-3 cursor-pointer transition-all duration-200 border-2 border-transparent;
}

.payment-method-card.active {
  @apply border-blue-500 bg-blue-900/20;
}

.purchase-dialog :deep(.el-dialog) {
  @apply bg-dark-800 border border-dark-700;
}

.purchase-dialog :deep(.el-dialog__title) {
  @apply text-white;
}
</style> 