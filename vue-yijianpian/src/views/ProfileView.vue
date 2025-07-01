<template>
  <div class="profile-view">
    <!-- 页面标题栏 -->
    <div class="bg-dark-800/50 border-b border-dark-700">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-white">👤 个人中心</h1>
        <p class="text-gray-400 mt-2">管理您的个人信息和账户设置</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- 左侧：用户信息卡片 -->
        <div class="lg:col-span-1">
          <div class="card text-center">
            <!-- 头像 -->
            <div class="mb-6">
              <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-white text-3xl font-bold">{{ userInfo.name.charAt(0) }}</span>
              </div>
              <el-button size="small" @click="showAvatarDialog = true">
                📷 更换头像
              </el-button>
            </div>

            <!-- 基本信息 -->
            <div class="space-y-3 mb-6">
              <h2 class="text-xl font-bold text-white">{{ userInfo.name }}</h2>
              <p class="text-gray-400">{{ userInfo.email }}</p>
              <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/20 text-green-400 border border-green-500/30">
                ✅ 已认证
              </div>
            </div>

            <!-- 账户统计 -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-dark-700 rounded-lg p-3">
                <div class="text-2xl font-bold text-yellow-400">{{ userStats.balance }}</div>
                <div class="text-xs text-gray-400">黄豆余额</div>
              </div>
              <div class="bg-dark-700 rounded-lg p-3">
                <div class="text-2xl font-bold text-blue-400">{{ userStats.totalTasks }}</div>
                <div class="text-xs text-gray-400">处理任务</div>
              </div>
            </div>

            <!-- 会员等级 -->
            <div class="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-lg p-4">
              <div class="flex items-center justify-center mb-2">
                <span class="text-yellow-400 text-lg mr-2">👑</span>
                <span class="font-semibold text-yellow-400">{{ userInfo.memberLevel }}</span>
              </div>
              <div class="text-xs text-gray-400">
                累计消费: {{ userStats.totalSpent }} 黄豆
              </div>
              <div class="w-full bg-dark-600 rounded-full h-2 mt-2">
                <div 
                  class="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                  :style="{ width: memberProgress + '%' }"
                ></div>
              </div>
              <div class="text-xs text-gray-400 mt-1">
                距离下一等级还需 {{ nextLevelRequirement - userStats.totalSpent }} 黄豆
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：设置面板 -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- 个人信息设置 -->
          <div class="card">
            <h3 class="text-xl font-bold text-white mb-6">📝 个人信息</h3>
            <el-form :model="profileForm" label-width="100px" class="space-y-4">
              <el-form-item label="用户名" class="text-white">
                <el-input v-model="profileForm.name" placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="邮箱" class="text-white">
                <el-input v-model="profileForm.email" placeholder="请输入邮箱" type="email" />
              </el-form-item>
              <el-form-item label="手机号" class="text-white">
                <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item label="公司" class="text-white">
                <el-input v-model="profileForm.company" placeholder="请输入公司名称（可选）" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateProfile">保存修改</el-button>
                <el-button @click="resetProfileForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 账户安全 -->
          <div class="card">
            <h3 class="text-xl font-bold text-white mb-6">🔒 账户安全</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between py-3 border-b border-dark-700">
                <div>
                  <div class="text-white font-medium">登录密码</div>
                  <div class="text-sm text-gray-400">建议定期更换密码以保障账户安全</div>
                </div>
                <el-button size="small" @click="showPasswordDialog = true">
                  修改密码
                </el-button>
              </div>
              
              <div class="flex items-center justify-between py-3 border-b border-dark-700">
                <div>
                  <div class="text-white font-medium">手机验证</div>
                  <div class="text-sm text-gray-400">
                    <span v-if="userInfo.phoneVerified" class="text-green-400">✅ 已验证</span>
                    <span v-else class="text-yellow-400">⚠️ 未验证</span>
                  </div>
                </div>
                <el-button 
                  size="small" 
                  :type="userInfo.phoneVerified ? 'default' : 'primary'"
                  @click="showPhoneDialog = true"
                >
                  {{ userInfo.phoneVerified ? '更换手机' : '绑定手机' }}
                </el-button>
              </div>

              <div class="flex items-center justify-between py-3">
                <div>
                  <div class="text-white font-medium">两步验证</div>
                  <div class="text-sm text-gray-400">
                    <span v-if="userInfo.twoFactorEnabled" class="text-green-400">✅ 已启用</span>
                    <span v-else class="text-gray-400">❌ 未启用</span>
                  </div>
                </div>
                <el-button 
                  size="small" 
                  :type="userInfo.twoFactorEnabled ? 'danger' : 'primary'"
                  @click="toggleTwoFactor"
                >
                  {{ userInfo.twoFactorEnabled ? '关闭' : '启用' }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- API 设置 -->
          <div class="card">
            <h3 class="text-xl font-bold text-white mb-6">🔑 API 密钥管理</h3>
            <div class="space-y-4">
              <div class="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div class="flex items-center mb-2">
                  <span class="text-blue-400 mr-2">ℹ️</span>
                  <span class="text-blue-400 font-medium">API 密钥用途</span>
                </div>
                <p class="text-sm text-gray-300">
                  API密钥用于程序化调用视频处理服务。请妥善保管您的密钥，不要在客户端代码中直接使用。
                </p>
              </div>

              <div v-if="apiKeys.length > 0" class="space-y-3">
                <div 
                  v-for="key in apiKeys" 
                  :key="key.id"
                  class="bg-dark-700 rounded-lg p-4"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="flex items-center mb-2">
                        <h4 class="text-white font-medium mr-3">{{ key.name }}</h4>
                        <span 
                          class="px-2 py-1 rounded text-xs font-medium"
                          :class="key.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'"
                        >
                          {{ key.status === 'active' ? '活跃' : '禁用' }}
                        </span>
                      </div>
                      <div class="text-sm text-gray-400 space-y-1">
                        <div>密钥: {{ key.masked }}</div>
                        <div>创建时间: {{ formatDate(key.createdAt) }}</div>
                        <div>最后使用: {{ key.lastUsed ? formatDate(key.lastUsed) : '从未使用' }}</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-2">
                      <el-button size="small" @click="copyApiKey(key)">
                        📋 复制
                      </el-button>
                      <el-button 
                        size="small" 
                        :type="key.status === 'active' ? 'warning' : 'success'"
                        @click="toggleApiKey(key)"
                      >
                        {{ key.status === 'active' ? '禁用' : '启用' }}
                      </el-button>
                      <el-button 
                        size="small" 
                        type="danger" 
                        @click="deleteApiKey(key.id)"
                      >
                        🗑️ 删除
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-8">
                <div class="text-4xl mb-4">🔑</div>
                <p class="text-gray-400 mb-4">您还没有创建任何API密钥</p>
              </div>

              <el-button type="primary" @click="showCreateApiKeyDialog = true" class="w-full">
                ➕ 创建新密钥
              </el-button>
            </div>
          </div>

          <!-- 通知设置 -->
          <div class="card">
            <h3 class="text-xl font-bold text-white mb-6">🔔 通知设置</h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between py-3 border-b border-dark-700">
                <div>
                  <div class="text-white font-medium">任务完成通知</div>
                  <div class="text-sm text-gray-400">视频处理完成时接收通知</div>
                </div>
                <el-switch v-model="notificationSettings.taskComplete" />
              </div>
              
              <div class="flex items-center justify-between py-3 border-b border-dark-700">
                <div>
                  <div class="text-white font-medium">余额不足提醒</div>
                  <div class="text-sm text-gray-400">余额低于设定值时提醒</div>
                </div>
                <el-switch v-model="notificationSettings.lowBalance" />
              </div>

              <div class="flex items-center justify-between py-3">
                <div>
                  <div class="text-white font-medium">营销邮件</div>
                  <div class="text-sm text-gray-400">接收产品更新和优惠信息</div>
                </div>
                <el-switch v-model="notificationSettings.marketing" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="400px" class="profile-dialog">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input v-model="passwordForm.currentPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="showPasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="updatePassword">确认修改</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 创建API密钥弹窗 -->
    <el-dialog v-model="showCreateApiKeyDialog" title="创建API密钥" width="400px" class="profile-dialog">
      <el-form :model="apiKeyForm">
        <el-form-item label="密钥名称">
          <el-input v-model="apiKeyForm.name" placeholder="为您的密钥命名" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            v-model="apiKeyForm.description" 
            type="textarea" 
            :rows="3"
            placeholder="描述这个密钥的用途（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <el-button @click="showCreateApiKeyDialog = false">取消</el-button>
          <el-button type="primary" @click="createApiKey">创建密钥</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

// 响应式数据
const showAvatarDialog = ref(false)
const showPasswordDialog = ref(false)
const showPhoneDialog = ref(false)
const showCreateApiKeyDialog = ref(false)

// 用户信息
const userInfo = ref({
  name: '张创作者',
  email: 'creator@example.com',
  phone: '138****8888',
  company: '创意工作室',
  avatar: '',
  memberLevel: '白银会员',
  phoneVerified: true,
  twoFactorEnabled: false
})

// 用户统计
const userStats = ref({
  balance: 1580,
  totalTasks: 42,
  totalSpent: 2850
})

// 表单数据
const profileForm = reactive({
  name: userInfo.value.name,
  email: userInfo.value.email,
  phone: userInfo.value.phone,
  company: userInfo.value.company
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const apiKeyForm = reactive({
  name: '',
  description: ''
})

// 通知设置
const notificationSettings = reactive({
  taskComplete: true,
  lowBalance: true,
  marketing: false
})

// API密钥列表
const apiKeys = ref([
  {
    id: '1',
    name: '主要API密钥',
    key: 'yk_1234567890abcdef1234567890abcdef',
    masked: 'yk_123...cdef',
    status: 'active',
    createdAt: new Date('2024-06-01T10:00:00'),
    lastUsed: new Date('2024-06-30T15:30:00')
  },
  {
    id: '2',
    name: '测试环境密钥',
    key: 'yk_abcdef1234567890abcdef1234567890',
    masked: 'yk_abc...7890',
    status: 'active',
    createdAt: new Date('2024-06-15T14:20:00'),
    lastUsed: null
  }
])

// 密码验证规则
const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 计算属性
const memberProgress = computed(() => {
  const levels = {
    '青铜会员': 0,
    '白银会员': 1000,
    '黄金会员': 5000,
    '钻石会员': 15000
  }
  const currentLevel = levels[userInfo.value.memberLevel as keyof typeof levels] || 0
  const nextLevel = Object.values(levels).find(level => level > userStats.value.totalSpent) || 15000
  return Math.min(100, (userStats.value.totalSpent / nextLevel) * 100)
})

const nextLevelRequirement = computed(() => {
  const levels = [1000, 5000, 15000]
  return levels.find(level => level > userStats.value.totalSpent) || 15000
})

// 方法
const updateProfile = () => {
  Object.assign(userInfo.value, profileForm)
  ElMessage.success('个人信息更新成功')
}

const resetProfileForm = () => {
  Object.assign(profileForm, {
    name: userInfo.value.name,
    email: userInfo.value.email,
    phone: userInfo.value.phone,
    company: userInfo.value.company
  })
}

const updatePassword = () => {
  // 这里应该验证表单
  ElMessage.success('密码修改成功')
  showPasswordDialog.value = false
  
  // 重置表单
  Object.assign(passwordForm, {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
}

const toggleTwoFactor = () => {
  userInfo.value.twoFactorEnabled = !userInfo.value.twoFactorEnabled
  ElMessage.success(
    userInfo.value.twoFactorEnabled ? '两步验证已启用' : '两步验证已关闭'
  )
}

const createApiKey = () => {
  if (!apiKeyForm.name.trim()) {
    ElMessage.error('请输入密钥名称')
    return
  }

  const newKey = {
    id: Date.now().toString(),
    name: apiKeyForm.name,
    key: `yk_${Math.random().toString(36).substr(2, 32)}`,
    masked: `yk_${Math.random().toString(36).substr(2, 3)}...${Math.random().toString(36).substr(2, 4)}`,
    status: 'active',
    createdAt: new Date(),
    lastUsed: null
  }

  apiKeys.value.push(newKey)
  
  ElNotification({
    title: 'API密钥创建成功',
    message: `密钥: ${newKey.key}`,
    type: 'success',
    duration: 10000
  })

  showCreateApiKeyDialog.value = false
  
  // 重置表单
  Object.assign(apiKeyForm, {
    name: '',
    description: ''
  })
}

const copyApiKey = (key: any) => {
  navigator.clipboard.writeText(key.key).then(() => {
    ElMessage.success('API密钥已复制到剪贴板')
  })
}

const toggleApiKey = (key: any) => {
  key.status = key.status === 'active' ? 'disabled' : 'active'
  ElMessage.success(`密钥已${key.status === 'active' ? '启用' : '禁用'}`)
}

const deleteApiKey = async (keyId: string) => {
  try {
    await ElMessageBox.confirm('确定要删除这个API密钥吗？删除后无法恢复。', '确认删除', {
      type: 'warning'
    })
    
    const index = apiKeys.value.findIndex(key => key.id === keyId)
    if (index > -1) {
      apiKeys.value.splice(index, 1)
      ElMessage.success('API密钥已删除')
    }
  } catch {
    // 用户取消
  }
}

const formatDate = (date: Date) => {
  return date.toLocaleString('zh-CN')
}
</script>

<style scoped>
.profile-dialog :deep(.el-dialog) {
  @apply bg-dark-800 border border-dark-700;
}

.profile-dialog :deep(.el-dialog__title) {
  @apply text-white;
}

.profile-dialog :deep(.el-form-item__label) {
  @apply text-gray-300;
}
</style> 