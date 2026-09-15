<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppButton from '@/components/AppButton.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useGroupMembers } from '@/features/group/composables/useGroupMembers'

const route = useRoute()
const router = useRouter()
const { findMember, deleteMember } = useGroupMembers()

const memberId = computed(() => String(route.params.memberId ?? ''))
const member = computed(() => findMember(memberId.value))

const impactDescription = computed(() => {
  const count = member.value?.bills.length ?? 0
  const name = member.value?.name ?? ''

  if (count === 0) {
    return `${name} dejará de tener acceso al grupo. No tiene facturas asignadas.`
  }

  if (count === 1) {
    return `${name} dejará de tener acceso al grupo. Su factura quedará sin responsable y volverá a la bolsa común hasta que asignes a alguien más.`
  }

  return `${name} dejará de tener acceso al grupo. Sus ${count} facturas quedarán sin responsable y volverán a la bolsa común hasta que asignes a alguien más.`
})

function returnToGroup(): void {
  void router.push({ name: 'group' })
}

function confirmDeletion(): void {
  if (deleteMember(memberId.value)) returnToGroup()
}

onMounted(() => {
  if (!member.value) void router.replace({ name: 'group' })
})
</script>

<template>
  <div class="min-h-screen min-w-[1120px] bg-[var(--surface-canvas)] text-[var(--text-primary)]">
    <AppSidebar />
    <main class="ml-[var(--sidebar-width)] min-h-screen px-12 py-12">
      <article v-if="member" class="mx-auto w-[504px]">
        <nav class="flex h-5 items-center gap-2 text-sm leading-5" aria-label="Ruta de navegación">
          <button type="button" class="text-[var(--text-secondary)]" @click="returnToGroup">
            Grupo
          </button>
          <span class="text-[var(--color-neutral-500)]" aria-hidden="true">›</span>
          <span class="font-medium text-[var(--color-neutral-900)]" aria-current="page">
            {{ member.name }}
          </span>
        </nav>

        <header class="mt-6">
          <h1 class="text-[32px] font-medium leading-10">Eliminar a {{ member.name }} del grupo</h1>
          <p class="mt-2 text-base leading-6 text-[var(--text-secondary)]">
            {{ impactDescription }}
          </p>
        </header>

        <section
          class="mt-12 rounded border border-[var(--color-warning-500)] bg-[var(--color-warning-100)] p-6"
          aria-labelledby="affected-bills-title"
        >
          <h2 id="affected-bills-title" class="text-sm font-medium leading-5">
            Facturas que quedarán sin responsable
          </h2>
          <ul class="mt-4 flex list-none flex-col gap-4 p-0 text-sm leading-5">
            <li v-for="bill in member.bills" :key="bill.id" class="flex justify-between gap-8">
              <span>{{ bill.name }}</span>
              <span class="text-right text-[var(--color-warning-900)]">{{ bill.status }}</span>
            </li>
          </ul>
        </section>

        <div class="mt-12 flex justify-end gap-3">
          <AppButton variant="secondary" class="w-40" @click="returnToGroup">Cancelar</AppButton>
          <AppButton variant="destructive" class="w-[200px]" @click="confirmDeletion">
            Eliminar del grupo
          </AppButton>
        </div>
      </article>
    </main>
  </div>
</template>
