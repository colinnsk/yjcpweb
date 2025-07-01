<template>
  <div class="notification-container fixed top-4 right-4 z-50 space-y-2">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification"
        :class="getNotificationClass(notification.type)"
      >
        <div class="flex items-start">
          <div class="notification-icon">
            <span>{{ getNotificationIcon(notification.type) }}</span>
          </div>
          <div class="flex-1 ml-3">
            <h4 class="notification-title">{{ notification.title }}</h4>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          <button 
            @click="removeNotification(notification.id)"
            class="notification-close"
          >
            ✕
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Notification, NotificationType } from '@/types'

// 通知列表
const notifications = ref<Notification[]>([])

// 模拟一些通知数据（实际项目中应该从store获取）
onMounted(() => {
  // 可以从Pinia store获取通知数据
})

// 获取通知样式类
const getNotificationClass = (type: NotificationType) => {
  const baseClass = 'notification-item'
  const typeClasses = {
    success: 'notification-success',
    error: 'notification-error',
    warning: 'notification-warning',
    info: 'notification-info'
  }
  return `${baseClass} ${typeClasses[type]}`
}

// 获取通知图标
const getNotificationIcon = (type: NotificationType) => {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[type]
}

// 移除通知
const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

// 添加通知的方法（可以被外部调用）
const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    isRead: false
  }
  
  notifications.value.push(newNotification)
  
  // 自动移除通知
  if (notification.duration !== 0) {
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, notification.duration || 5000)
  }
}

// 暴露方法供外部使用
defineExpose({
  addNotification
})
</script>

<style scoped>
.notification-container {
  max-width: 400px;
  pointer-events: none;
}

.notification {
  pointer-events: auto;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  max-width: 400px;
}

.notification-item {
  @apply text-white;
}

.notification-success {
  @apply border-green-500/30 bg-green-900/20;
}

.notification-error {
  @apply border-red-500/30 bg-red-900/20;
}

.notification-warning {
  @apply border-yellow-500/30 bg-yellow-900/20;
}

.notification-info {
  @apply border-blue-500/30 bg-blue-900/20;
}

.notification-icon {
  @apply w-6 h-6 flex items-center justify-center rounded-lg text-lg;
}

.notification-title {
  @apply font-semibold text-sm mb-1;
}

.notification-message {
  @apply text-xs text-gray-300;
}

.notification-close {
  @apply text-gray-400 hover:text-white transition-colors p-1 text-sm;
}

/* 动画效果 */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}
</style> 