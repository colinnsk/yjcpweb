<script setup lang="ts">
import { useRouter } from 'vue-router'
import { VideoPlay, CreditCard, Lightning, Cpu, Lock } from '@element-plus/icons-vue'
import { capabilities, capabilitiesByCategory, categoryInfo } from '@/config/capabilities'
</script>

<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <section class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-6xl mx-auto text-center">
        <!-- MVP标志 -->
        <div class="mb-8">
          <span class="mvp-badge text-lg px-6 py-3">MVP版本</span>
        </div>
        
        <!-- 主标题 -->
        <h1 class="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
          一键<span class="gradient-text">出片</span>
        </h1>
        
        <!-- 副标题 -->
        <p class="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
          AI驱动的视频处理平台
        </p>
        <p class="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
          多种视频原子能力，简单上传，智能处理，快速获得专业级视频效果
        </p>
        
        <!-- CTA按钮 -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <el-button 
            type="primary" 
            size="large"
            @click="$router.push('/workspace')"
            class="btn-primary"
          >
            🎬 立即开始处理
          </el-button>
          <el-button 
            size="large"
            @click="$router.push('/pricing')"
            class="btn-secondary"
          >
            💳 查看定价
          </el-button>
        </div>
        
        <!-- 核心优势 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white text-2xl">⚡</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">快速处理</h3>
            <p class="text-gray-400">AI算法优化，平均处理时间仅需原视频时长的20%</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white text-2xl">🧠</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">智能识别</h3>
            <p class="text-gray-400">深度学习技术，自动识别处理对象，无需手动标记</p>
          </div>
          
          <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-white text-2xl">🔒</span>
            </div>
            <h3 class="text-xl font-semibold text-white mb-3">安全可靠</h3>
            <p class="text-gray-400">端到端加密，处理完成后自动删除，保护隐私安全</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 视频原子能力展示 -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-6">
            🎬 视频原子能力矩阵
          </h2>
          <p class="text-xl text-gray-300 max-w-3xl mx-auto">
            多种专业级视频处理能力，满足不同场景需求，每种能力都经过AI优化
          </p>
        </div>
        
        <!-- 智能去除能力 -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold text-white mb-8 text-center">
            <span class="text-blue-400">智能去除</span> • 核心功能
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="card-hover" @click="$router.push('/workspace?capability=removeSubtitle')">
              <div class="capability-icon bg-gradient-to-r from-blue-500 to-blue-600 mx-auto mb-4">
                <span class="text-2xl">📝</span>
              </div>
              <h4 class="text-xl font-bold text-white mb-3 text-center">去除字幕</h4>
              <p class="text-gray-300 text-sm mb-4 text-center">AI智能识别视频中的字幕文字，精准去除</p>
              <div class="flex justify-between items-center">
                <span class="text-blue-400 font-semibold">¥2/分钟</span>
                <span class="bg-green-600 text-white text-xs px-2 py-1 rounded">热门</span>
              </div>
            </div>

            <div class="card-hover" @click="$router.push('/workspace?capability=removeWatermark')">
              <div class="capability-icon bg-gradient-to-r from-green-500 to-green-600 mx-auto mb-4">
                <span class="text-2xl">💧</span>
              </div>
              <h4 class="text-xl font-bold text-white mb-3 text-center">去除水印</h4>
              <p class="text-gray-300 text-sm mb-4 text-center">智能检测和去除视频中的水印标识</p>
              <div class="flex justify-between items-center">
                <span class="text-blue-400 font-semibold">¥2.5/分钟</span>
                <span class="bg-blue-600 text-white text-xs px-2 py-1 rounded">推荐</span>
              </div>
            </div>

            <div class="card-hover" @click="$router.push('/workspace?capability=removeLogo')">
              <div class="capability-icon bg-gradient-to-r from-purple-500 to-purple-600 mx-auto mb-4">
                <span class="text-2xl">🚫</span>
              </div>
              <h4 class="text-xl font-bold text-white mb-3 text-center">去除Logo</h4>
              <p class="text-gray-300 text-sm mb-4 text-center">精准识别并去除视频中的品牌Logo</p>
              <div class="flex justify-between items-center">
                <span class="text-blue-400 font-semibold">¥2/分钟</span>
                <span class="bg-purple-600 text-white text-xs px-2 py-1 rounded">专业</span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI创作能力 -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold text-white mb-8 text-center">
            <span class="text-pink-400">AI创作</span> • 创新功能
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div class="card-hover" @click="$router.push('/workspace?capability=voiceClone')">
              <div class="capability-icon bg-gradient-to-r from-pink-500 to-pink-600 mx-auto mb-4">
                <span class="text-2xl">🎤</span>
              </div>
              <h4 class="text-xl font-bold text-white mb-3 text-center">声音克隆</h4>
              <p class="text-gray-300 text-sm mb-4 text-center">克隆生成个性化声音，用于数智人视频</p>
              <div class="flex justify-between items-center">
                <span class="text-blue-400 font-semibold">¥10/次</span>
                <span class="bg-pink-600 text-white text-xs px-2 py-1 rounded">创新</span>
              </div>
            </div>

            <div class="card-hover" @click="$router.push('/workspace?capability=digitalHuman')">
              <div class="capability-icon bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto mb-4">
                <span class="text-2xl">🧑‍🚀</span>
              </div>
              <h4 class="text-xl font-bold text-white mb-3 text-center">数智人生成</h4>
              <p class="text-gray-300 text-sm mb-4 text-center">快速生成数智人视频，无需训练</p>
              <div class="flex justify-between items-center">
                <span class="text-blue-400 font-semibold">¥15/次</span>
                <span class="bg-cyan-600 text-white text-xs px-2 py-1 rounded">前沿</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 社会证明 -->
    <section class="py-20 px-4 bg-dark-800/50">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-white mb-12">受到创作者们的信赖</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="text-center">
            <div class="text-4xl font-bold text-blue-400 mb-2">15,000+</div>
            <div class="text-gray-300">活跃创作者</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-green-400 mb-2">800万+</div>
            <div class="text-gray-300">视频处理次数</div>
          </div>
          <div class="text-center">
            <div class="text-4xl font-bold text-yellow-400 mb-2">4.9分</div>
            <div class="text-gray-300">用户评价</div>
          </div>
        </div>
        
        <!-- 用户评价 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="card p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                <span class="text-white font-bold">张</span>
              </div>
              <div>
                <div class="font-semibold text-white">张小影</div>
                <div class="text-sm text-gray-400">短视频博主</div>
              </div>
            </div>
            <p class="text-gray-300">"一键出片真的太方便了！以前去水印要用复杂的软件，现在几分钟就搞定了，效果还特别好。"</p>
          </div>
          
          <div class="card p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                <span class="text-white font-bold">李</span>
              </div>
              <div>
                <div class="font-semibold text-white">李创作</div>
                <div class="text-sm text-gray-400">自媒体运营</div>
              </div>
            </div>
            <p class="text-gray-300">"声音克隆功能太强了！现在我可以用自己的声音做数字人视频，粉丝都以为是我真人出镜。"</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
