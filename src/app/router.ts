import { createRouter, createWebHistory } from 'vue-router'

import GroupView from '@/features/group/views/GroupView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: { name: 'group' },
    },
    {
      path: '/grupo',
      name: 'group',
      component: GroupView,
      meta: { title: 'Grupo' },
    },
  ],
})

router.afterEach((to) => {
  document.title = typeof to.meta.title === 'string' ? `${to.meta.title} · Fakto` : 'Fakto'
})

export default router
