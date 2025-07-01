<template>
  <div class="developer-view">
    <!-- 页面标题栏 -->
    <div class="bg-dark-800/50 border-b border-dark-700">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-white">💻 开发者中心</h1>
          <p class="text-gray-400 mt-2">API文档、SDK下载和开发者资源</p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- 快速开始 -->
      <section class="mb-16">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-4">🚀 快速开始</h2>
          <p class="text-gray-400">3步集成一键出片API到您的应用中</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white text-2xl">🔑</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">1. 获取API密钥</h3>
            <p class="text-gray-400 mb-4">在个人中心创建API密钥，用于身份验证</p>
            <router-link to="/profile" class="text-blue-400 hover:underline">
              创建密钥 →
            </router-link>
          </div>

          <div class="card text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white text-2xl">📚</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">2. 查看文档</h3>
            <p class="text-gray-400 mb-4">阅读API文档了解接口调用方法</p>
            <a href="#api-docs" class="text-blue-400 hover:underline">
              查看文档 →
            </a>
          </div>

          <div class="card text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white text-2xl">⚡</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">3. 开始调用</h3>
            <p class="text-gray-400 mb-4">使用SDK或直接调用REST API</p>
            <a href="#sdk-download" class="text-blue-400 hover:underline">
              下载SDK →
            </a>
          </div>
        </div>
      </section>

      <!-- SDK下载 -->
      <section id="sdk-download" class="mb-16">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-4">📦 SDK下载</h2>
          <p class="text-gray-400">官方提供多种编程语言的SDK</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="sdk in sdks" :key="sdk.language" class="card text-center">
            <div class="text-4xl mb-4">{{ sdk.icon }}</div>
            <h3 class="text-white font-semibold mb-2">{{ sdk.language }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ sdk.description }}</p>
            <div class="space-y-2">
              <el-button size="small" type="primary" @click="downloadSDK(sdk)">
                📥 下载SDK
              </el-button>
              <div class="text-xs text-gray-500">
                v{{ sdk.version }} | {{ sdk.size }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- API文档 -->
      <section id="api-docs" class="mb-16">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-4">📖 API文档</h2>
          <p class="text-gray-400">详细的REST API接口文档</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <!-- 侧边栏导航 -->
          <div class="lg:col-span-1">
            <div class="card">
              <h3 class="text-white font-semibold mb-4">📋 目录</h3>
              <nav class="space-y-2">
                <a 
                  v-for="section in docSections" 
                  :key="section.id"
                  :href="`#${section.id}`"
                  class="block text-gray-400 hover:text-blue-400 transition-colors text-sm py-1"
                  :class="{ 'text-blue-400': activeSection === section.id }"
                  @click="activeSection = section.id"
                >
                  {{ section.title }}
                </a>
              </nav>
            </div>
          </div>

          <!-- 文档内容 -->
          <div class="lg:col-span-3">
            <div class="card">
              <!-- 基础信息 -->
              <div v-show="activeSection === 'basic'" class="space-y-6">
                <div>
                  <h3 class="text-xl font-bold text-white mb-4">🔧 基础信息</h3>
                  <div class="bg-dark-700 rounded-lg p-4 space-y-3">
                    <div>
                      <span class="text-gray-400">API基础地址：</span>
                      <code class="text-blue-400 bg-dark-800 px-2 py-1 rounded">https://api.yijianpian.com/v1</code>
                    </div>
                    <div>
                      <span class="text-gray-400">认证方式：</span>
                      <code class="text-green-400 bg-dark-800 px-2 py-1 rounded">Bearer Token</code>
                    </div>
                    <div>
                      <span class="text-gray-400">请求格式：</span>
                      <code class="text-yellow-400 bg-dark-800 px-2 py-1 rounded">application/json</code>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-lg font-semibold text-white mb-3">认证示例</h4>
                  <pre class="bg-dark-800 p-4 rounded-lg overflow-x-auto"><code class="text-gray-300">curl -X POST https://api.yijianpian.com/v1/process \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "capability": "removeSubtitle",
    "file_url": "https://example.com/video.mp4"
  }'</code></pre>
                </div>
              </div>

              <!-- 视频处理接口 -->
              <div v-show="activeSection === 'video-process'" class="space-y-6">
                <div>
                  <h3 class="text-xl font-bold text-white mb-4">🎬 视频处理接口</h3>
                  
                  <div class="space-y-4">
                    <div class="bg-dark-700 rounded-lg p-4">
                      <div class="flex items-center mb-2">
                        <span class="bg-green-600 text-white text-xs px-2 py-1 rounded mr-2">POST</span>
                        <code class="text-blue-400">/v1/process</code>
                      </div>
                      <p class="text-gray-400 text-sm">提交视频处理任务</p>
                    </div>

                    <div>
                      <h4 class="text-white font-semibold mb-2">请求参数</h4>
                      <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                          <thead>
                            <tr class="border-b border-dark-600">
                              <th class="text-left py-2 text-gray-400">参数名</th>
                              <th class="text-left py-2 text-gray-400">类型</th>
                              <th class="text-left py-2 text-gray-400">必填</th>
                              <th class="text-left py-2 text-gray-400">说明</th>
                            </tr>
                          </thead>
                          <tbody class="text-gray-300">
                            <tr class="border-b border-dark-700/50">
                              <td class="py-2"><code>capability</code></td>
                              <td class="py-2">string</td>
                              <td class="py-2 text-red-400">是</td>
                              <td class="py-2">处理能力ID</td>
                            </tr>
                            <tr class="border-b border-dark-700/50">
                              <td class="py-2"><code>file_url</code></td>
                              <td class="py-2">string</td>
                              <td class="py-2 text-red-400">是</td>
                              <td class="py-2">视频文件URL</td>
                            </tr>
                            <tr class="border-b border-dark-700/50">
                              <td class="py-2"><code>callback_url</code></td>
                              <td class="py-2">string</td>
                              <td class="py-2 text-gray-500">否</td>
                              <td class="py-2">完成回调地址</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h4 class="text-white font-semibold mb-2">响应示例</h4>
                      <pre class="bg-dark-800 p-4 rounded-lg overflow-x-auto"><code class="text-gray-300">{
  "code": 200,
  "message": "success",
  "data": {
    "task_id": "t_1234567890",
    "status": "pending",
    "estimated_time": 120,
    "cost": 6
  }
}</code></pre>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 任务查询接口 -->
              <div v-show="activeSection === 'task-query'" class="space-y-6">
                <div>
                  <h3 class="text-xl font-bold text-white mb-4">📋 任务查询接口</h3>
                  
                  <div class="space-y-4">
                    <div class="bg-dark-700 rounded-lg p-4">
                      <div class="flex items-center mb-2">
                        <span class="bg-blue-600 text-white text-xs px-2 py-1 rounded mr-2">GET</span>
                        <code class="text-blue-400">/v1/task/{task_id}</code>
                      </div>
                      <p class="text-gray-400 text-sm">查询任务处理状态</p>
                    </div>

                    <div>
                      <h4 class="text-white font-semibold mb-2">响应示例</h4>
                      <pre class="bg-dark-800 p-4 rounded-lg overflow-x-auto"><code class="text-gray-300">{
  "code": 200,
  "message": "success",
  "data": {
    "task_id": "t_1234567890",
    "status": "completed",
    "progress": 100,
    "result_url": "https://cdn.yijianpian.com/result.mp4",
    "cost": 6,
    "created_at": "2024-06-30T10:30:00Z",
    "completed_at": "2024-06-30T10:32:15Z"
  }
}</code></pre>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 错误码 -->
              <div v-show="activeSection === 'error-codes'" class="space-y-6">
                <div>
                  <h3 class="text-xl font-bold text-white mb-4">❌ 错误码说明</h3>
                  
                  <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                      <thead>
                        <tr class="border-b border-dark-600">
                          <th class="text-left py-3 text-gray-400">错误码</th>
                          <th class="text-left py-3 text-gray-400">说明</th>
                          <th class="text-left py-3 text-gray-400">解决方案</th>
                        </tr>
                      </thead>
                      <tbody class="text-gray-300">
                        <tr v-for="error in errorCodes" :key="error.code" class="border-b border-dark-700/50">
                          <td class="py-3">
                            <code class="bg-red-900/20 text-red-400 px-2 py-1 rounded">{{ error.code }}</code>
                          </td>
                          <td class="py-3">{{ error.message }}</td>
                          <td class="py-3 text-gray-400">{{ error.solution }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 代码示例 -->
      <section class="mb-16">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-4">💡 代码示例</h2>
          <p class="text-gray-400">常见编程语言的集成示例</p>
        </div>

        <div class="card">
          <div class="flex border-b border-dark-700">
            <button 
              v-for="lang in codeExamples" 
              :key="lang.language"
              class="px-4 py-3 text-sm font-medium transition-colors"
              :class="activeCodeLang === lang.language ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'"
              @click="activeCodeLang = lang.language"
            >
              {{ lang.language }}
            </button>
          </div>
          
          <div class="p-6">
            <div v-for="example in codeExamples" :key="example.language" v-show="activeCodeLang === example.language">
              <h4 class="text-white font-semibold mb-3">{{ example.language }} 示例</h4>
              <pre class="bg-dark-800 p-4 rounded-lg overflow-x-auto"><code class="text-gray-300">{{ example.code }}</code></pre>
            </div>
          </div>
        </div>
      </section>

      <!-- API测试工具 -->
      <section class="mb-16">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-4">🧪 API测试工具</h2>
          <p class="text-gray-400">在线测试API接口</p>
        </div>

        <div class="card">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- 请求配置 -->
            <div>
              <h3 class="text-white font-semibold mb-4">📤 请求配置</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-gray-400 text-sm mb-2">API密钥</label>
                  <el-input 
                    v-model="testForm.apiKey" 
                    placeholder="请输入您的API密钥"
                    type="password"
                    show-password
                  />
                </div>
                
                <div>
                  <label class="block text-gray-400 text-sm mb-2">处理能力</label>
                  <el-select v-model="testForm.capability" placeholder="选择处理能力" class="w-full">
                    <el-option 
                      v-for="cap in Object.values(capabilities)" 
                      :key="cap.id"
                      :label="cap.name" 
                      :value="cap.id" 
                    />
                  </el-select>
                </div>

                <div>
                  <label class="block text-gray-400 text-sm mb-2">文件URL</label>
                  <el-input 
                    v-model="testForm.fileUrl" 
                    placeholder="https://example.com/video.mp4"
                  />
                </div>

                <el-button 
                  type="primary" 
                  :loading="testLoading"
                  @click="testAPI"
                  class="w-full"
                >
                  🚀 发送测试请求
                </el-button>
              </div>
            </div>

            <!-- 响应结果 -->
            <div>
              <h3 class="text-white font-semibold mb-4">📥 响应结果</h3>
              <div class="bg-dark-800 rounded-lg p-4 h-64 overflow-y-auto">
                <pre v-if="testResult" class="text-gray-300 text-sm">{{ JSON.stringify(testResult, null, 2) }}</pre>
                <div v-else class="text-gray-500 text-sm">等待发送请求...</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系支持 -->
      <section>
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-white mb-4">🤝 技术支持</h2>
          <p class="text-gray-400">遇到问题？我们来帮助您</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="card text-center">
            <div class="text-4xl mb-4">📧</div>
            <h3 class="text-white font-semibold mb-2">邮件支持</h3>
            <p class="text-gray-400 text-sm mb-4">工作日24小时内回复</p>
            <a href="mailto:api@yijianpian.com" class="text-blue-400 hover:underline">
              api@yijianpian.com
            </a>
          </div>

          <div class="card text-center">
            <div class="text-4xl mb-4">💬</div>
            <h3 class="text-white font-semibold mb-2">在线客服</h3>
            <p class="text-gray-400 text-sm mb-4">工作时间实时响应</p>
            <el-button size="small" type="primary">
              开始对话
            </el-button>
          </div>

          <div class="card text-center">
            <div class="text-4xl mb-4">📖</div>
            <h3 class="text-white font-semibold mb-2">文档反馈</h3>
            <p class="text-gray-400 text-sm mb-4">发现文档问题？</p>
            <a href="https://github.com/yijianpian/docs" class="text-blue-400 hover:underline" target="_blank">
              GitHub Issues
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { capabilities } from '@/config/capabilities'

// 响应式数据
const activeSection = ref('basic')
const activeCodeLang = ref('JavaScript')
const testLoading = ref(false)
const testResult = ref<any>(null)

// 测试表单
const testForm = reactive({
  apiKey: '',
  capability: '',
  fileUrl: ''
})

// SDK列表
const sdks = ref([
  {
    language: 'JavaScript',
    icon: '📄',
    description: 'Node.js SDK',
    version: '1.2.3',
    size: '2.1MB'
  },
  {
    language: 'Python',
    icon: '🐍',
    description: 'Python SDK',
    version: '1.2.1',
    size: '1.8MB'
  },
  {
    language: 'Java',
    icon: '☕',
    description: 'Java SDK',
    version: '1.1.5',
    size: '3.2MB'
  },
  {
    language: 'PHP',
    icon: '🐘',
    description: 'PHP SDK',
    version: '1.0.8',
    size: '1.5MB'
  }
])

// 文档章节
const docSections = ref([
  { id: 'basic', title: '基础信息' },
  { id: 'video-process', title: '视频处理接口' },
  { id: 'task-query', title: '任务查询接口' },
  { id: 'error-codes', title: '错误码说明' }
])

// 错误码列表
const errorCodes = ref([
  { code: 401, message: '认证失败', solution: '检查API密钥是否正确' },
  { code: 403, message: '权限不足', solution: '确认API密钥有相应权限' },
  { code: 429, message: '请求频率超限', solution: '降低请求频率或升级套餐' },
  { code: 400, message: '参数错误', solution: '检查请求参数格式和内容' },
  { code: 404, message: '资源不存在', solution: '检查任务ID或文件URL' },
  { code: 500, message: '服务器错误', solution: '稍后重试或联系技术支持' }
])

// 代码示例
const codeExamples = ref([
  {
    language: 'JavaScript',
    code: `const axios = require('axios');

async function processVideo() {
  try {
    const response = await axios.post('https://api.yijianpian.com/v1/process', {
      capability: 'removeSubtitle',
      file_url: 'https://example.com/video.mp4',
      callback_url: 'https://your-site.com/callback'
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Task ID:', response.data.data.task_id);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}`
  },
  {
    language: 'Python',
    code: `import requests
import json

def process_video():
    url = "https://api.yijianpian.com/v1/process"
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    data = {
        "capability": "removeSubtitle",
        "file_url": "https://example.com/video.mp4",
        "callback_url": "https://your-site.com/callback"
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        result = response.json()
        print(f"Task ID: {result['data']['task_id']}")
        return result
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None`
  },
  {
    language: 'PHP',
    code: `<?php
function processVideo() {
    $url = "https://api.yijianpian.com/v1/process";
    $data = [
        "capability" => "removeSubtitle",
        "file_url" => "https://example.com/video.mp4",
        "callback_url" => "https://your-site.com/callback"
    ];
    
    $options = [
        'http' => [
            'header' => [
                "Authorization: Bearer YOUR_API_KEY",
                "Content-Type: application/json"
            ],
            'method' => 'POST',
            'content' => json_encode($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    if ($result === FALSE) {
        echo "Error occurred";
        return null;
    }
    
    $response = json_decode($result, true);
    echo "Task ID: " . $response['data']['task_id'];
    return $response;
}
?>`
  }
])

// 方法
const downloadSDK = (sdk: any) => {
  ElMessage.success(`正在下载 ${sdk.language} SDK...`)
  // 实际项目中这里会触发真实的下载
}

const testAPI = async () => {
  if (!testForm.apiKey || !testForm.capability || !testForm.fileUrl) {
    ElMessage.error('请填写完整的测试参数')
    return
  }

  testLoading.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    testResult.value = {
      code: 200,
      message: "success",
      data: {
        task_id: "t_" + Date.now(),
        status: "pending",
        estimated_time: 120,
        cost: 6
      }
    }
    
    ElMessage.success('API测试成功')
  } catch (error) {
    testResult.value = {
      code: 400,
      message: "Bad Request",
      error: "Invalid parameters"
    }
    ElMessage.error('API测试失败')
  } finally {
    testLoading.value = false
  }
}
</script>

<style scoped>
/* 代码块样式 */
pre {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.4;
}

code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}

/* 滚动条样式 */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #1e293b;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #1e293b;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 3px;
}
</style> 