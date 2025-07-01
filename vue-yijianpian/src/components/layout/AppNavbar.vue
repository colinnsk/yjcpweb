<template>
  <nav class="bg-dark-900/90 backdrop-blur-sm border-b border-dark-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- 左侧：品牌和主导航 -->
        <div class="flex items-center space-x-8">
          <router-link to="/" class="text-xl font-bold text-white flex items-center hover:text-blue-400 transition-colors">
            <span class="text-2xl mr-2">🎬</span>
            一键出片
            <span class="mvp-badge ml-3">MVP</span>
          </router-link>
          
          <!-- 桌面端导航 -->
          <div class="hidden lg:flex space-x-4">
            <router-link 
              v-for="item in navItems" 
              :key="item.path"
              :to="item.path" 
              class="nav-link"
              :class="{ 'active': $route.path === item.path }"
            >
              <span class="mr-1">{{ item.icon }}</span>{{ item.name }}
            </router-link>
          </div>
        </div>
        
        <!-- 右侧：用户信息和操作 -->
        <div class="flex items-center space-x-4">
          <!-- 余额显示 -->
          <div class="hidden sm:flex items-center text-yellow-400 font-medium text-sm bg-dark-800 px-3 py-1 rounded-lg">
            <span class="mr-1">🟡</span>
            <span>{{ userBalance }}</span>
            <span class="ml-1">黄豆</span>
          </div>
          
          <!-- 用户信息 -->
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">{{ userInfo.name.charAt(0) }}</span>
            </div>
            <span class="hidden md:block text-white font-medium">{{ userInfo.name }}</span>
          </div>
          
          <!-- 移动端菜单按钮 -->
          <button 
            class="lg:hidden text-white hover:text-blue-400 p-2 rounded-lg hover:bg-dark-800 transition-colors" 
            @click="toggleMobileMenu"
          >
            <span class="text-xl">{{ isMobileMenuOpen ? '✕' : '☰' }}</span>
          </button>
        </div>
      </div>
      
      <!-- 移动端菜单 -->
      <div v-if="isMobileMenuOpen" class="lg:hidden border-t border-dark-700 py-3">
        <div class="space-y-1">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path" 
            class="mobile-nav-link"
            :class="{ 'active': $route.path === item.path }"
            @click="closeMobileMenu"
          >
            <span class="mr-2">{{ item.icon }}</span>{{ item.name }}
          </router-link>
        </div>
        
        <!-- 移动端余额显示 -->
        <div class="mt-4 pt-4 border-t border-dark-700">
          <div class="flex items-center justify-between text-yellow-400 font-medium text-sm">
            <span>账户余额</span>
            <span>🟡 {{ userBalance }} 黄豆</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 导航项配置
const navItems = [
  { name: '首页', path: '/', icon: '🏠' },
  { name: '工作台', path: '/workspace', icon: '⚙️' },
  { name: '任务', path: '/tasks', icon: '📋' },
  { name: '账单', path: '/billing', icon: '📊' },
  { name: '我的', path: '/profile', icon: '👤' },
  { name: '定价', path: '/pricing', icon: '💳' },
  { name: '开发', path: '/developer', icon: '💻' }
]

// 模拟用户数据
const userInfo = {
  name: '张创作者',
  avatar: '',
  id: '1'
}

const userBalance = ref(1580)

// 方法
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<style scoped>
.nav-link {
  @apply px-3 py-2 text-sm font-medium text-gray-300 hover:text-blue-400 hover:bg-dark-800 rounded-lg transition-all duration-200;
}

.nav-link.active {
  @apply text-white bg-blue-600/20 border-b-2 border-blue-500;
}

.mobile-nav-link {
  @apply block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg transition-colors;
}

.mobile-nav-link.active {
  @apply text-white bg-blue-600 text-white;
}

/* 导航栏粘性效果 */
nav {
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
</style> 