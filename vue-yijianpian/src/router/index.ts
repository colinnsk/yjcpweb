import { createRouter, createWebHistory } from 'vue-router'
import type { RouteMeta } from '@/types'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: {
        title: '首页',
        icon: 'house'
      } as RouteMeta,
    },
    {
      path: '/workspace',
      name: 'Workspace',
      component: () => import('@/views/WorkspaceView.vue'),
      meta: {
        title: '工作台',
        icon: 'magic'
      } as RouteMeta,
    },
    {
      path: '/tasks',
      name: 'Tasks',
      component: () => import('@/views/TasksView.vue'),
      meta: {
        title: '任务管理',
        icon: 'list-check'
      } as RouteMeta,
    },
    {
      path: '/billing',
      name: 'Billing',
      component: () => import('@/views/BillingView.vue'),
      meta: {
        title: '消费记录',
        icon: 'receipt'
      } as RouteMeta,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: {
        title: '个人中心',
        icon: 'user'
      } as RouteMeta,
    },
    {
      path: '/pricing',
      name: 'Pricing',
      component: () => import('@/views/PricingView.vue'),
      meta: {
        title: '套餐定价',
        icon: 'credit-card'
      } as RouteMeta,
    },
    {
      path: '/developer',
      name: 'Developer',
      component: () => import('@/views/DeveloperView.vue'),
      meta: {
        title: '开发者',
        icon: 'code'
      } as RouteMeta,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        title: '页面未找到',
        icon: 'exclamation-triangle'
      } as RouteMeta,
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 一键出片`
  }
  
  next()
})

export default router
