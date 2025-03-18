/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/components/templates/DefaultLayout.vue'
// import LoginForm from '@/components/molecules/LoginForm.vue'
import HomePage from '@/pages/HomePage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import SignUpPage from '@/pages/SignUpPage.vue'
import SubjectsPage from '@/pages/SubjectsPage.vue'
import WrongNotesPage from '@/pages/WrongNotesPage.vue'
import NotesPage from '@/pages/NotesPage.vue'
import MemoryTestPage from '@/pages/MemoryTestPage.vue'
import CalendarPage from '@/pages/CalendarPage.vue'
import StatisticsPage from '@/pages/StatisticsPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpPage
    },
    {
      path: '/subjects',
      name: 'subjects',
      component: SubjectsPage
    },
    {
      path: '/wrong-notes',
      name: 'wrong-notes',
      component: WrongNotesPage
    },
    {
      path: '/notes',
      name: 'notes',
      component: NotesPage
    },
    {
      path: '/memory-test',
      name: 'memory-test',
      component: MemoryTestPage
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: CalendarPage
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsPage
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsPage
    },
    {
      path: '/',
      component: DefaultLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/pages/DashboardPage.vue')
        },
        {
          path: 'subjects',
          name: 'subjects',
          component: () => import('@/pages/SubjectsPage.vue')
        },
        {
          path: 'wrong-notes',
          name: 'wrong-notes',
          component: () => import('@/pages/WrongNotesPage.vue')
        },
        {
          path: 'notes',
          name: 'notes',
          component: () => import('@/pages/NotesPage.vue')
        },
        {
          path: 'memory-test',
          name: 'memory-test',
          component: () => import('@/pages/MemoryTestPage.vue')
        },
        {
          path: 'calendar',
          name: 'calendar',
          component: () => import('@/pages/CalendarPage.vue')
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: () => import('@/pages/StatisticsPage.vue')
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/pages/ProfilePage.vue')
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/pages/SettingsPage.vue')
        }
      ]
    }
  ]
})

// 네비게이션 가드
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('token') // TODO: 실제 인증 로직으로 대체

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     next('/login')
//   } else if (to.path === '/login' && isAuthenticated) {
//     next('/dashboard')
//   } else {
//     next()
//   }
// })

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
