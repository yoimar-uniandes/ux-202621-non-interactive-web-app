import { createRouter, createWebHistory } from 'vue-router'

import GroupView from '@/features/group/views/GroupView.vue'
import DeleteMemberView from '@/features/group/views/DeleteMemberView.vue'
import AssignBillsView from '@/features/group/views/AssignBillsView.vue'
import InviteMemberView from '@/features/group/views/InviteMemberView.vue'

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
    {
      path: '/grupo/:memberId/eliminar',
      name: 'group-member-delete',
      component: DeleteMemberView,
      meta: { title: 'Eliminar miembro' },
    },
    {
      path: '/grupo/invitar',
      name: 'group-member-invite',
      component: InviteMemberView,
      meta: { title: 'Invitar miembro' },
    },
    {
      path: '/grupo/:memberId/asignar',
      name: 'group-member-assign',
      component: AssignBillsView,
      meta: { title: 'Asignar facturas' },
    },
  ],
})

router.afterEach((to) => {
  document.title = typeof to.meta.title === 'string' ? `${to.meta.title} · Fakto` : 'Fakto'
})

export default router
