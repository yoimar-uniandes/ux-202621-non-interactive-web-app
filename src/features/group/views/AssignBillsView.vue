<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import AppButton from '@/components/AppButton.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useGroupMembers } from '@/features/group/composables/useGroupMembers'

const route = useRoute()
const router = useRouter()
const { findMember } = useGroupMembers()

const memberId = computed(() => String(route.params.memberId ?? ''))
const member = computed(() => findMember(memberId.value))

const availableBills = [
  { id: 'epm', name: 'EPM', detail: 'Vence mañana', assignee: 'Sin responsable', tone: 'warning', checked: true },
  { id: 'internet', name: 'Internet', detail: 'Factura al día', assignee: 'A cargo de Daniel', tone: 'success', checked: false },
  { id: 'carro', name: 'Cuota carro', detail: 'Vence en 12 días', assignee: 'A cargo de Rafael', tone: 'default', checked: true },
  { id: 'arriendo', name: 'Arriendo', detail: 'Vence en 20 días', assignee: 'Sin responsable', tone: 'default', checked: false },
]

function returnToGroup(): void {
  void router.push({ name: 'group' })
}

onMounted(() => {
  if (!member.value) void router.replace({ name: 'group' })
})
</script>

<template>
  <div class="min-h-screen min-w-[1120px] bg-[var(--surface-canvas)] text-[var(--text-primary)]">
    <AppSidebar />
    <main class="ml-[var(--sidebar-width)] min-h-screen px-12 py-12">
      <article v-if="member" class="mx-auto w-full max-w-[1120px]">
        <nav class="flex h-5 items-center gap-2 text-sm leading-5" aria-label="Ruta de navegación">
          <button type="button" class="text-[var(--text-secondary)]" @click="returnToGroup">
            Grupo
          </button>
          <span class="text-[var(--color-neutral-500)]" aria-hidden="true">›</span>
          <span class="font-medium" aria-current="page">{{ member.name }}</span>
        </nav>

        <header class="mt-6">
          <h1 class="text-[32px] font-medium leading-10">Asignar facturas a {{ member.name }}</h1>
          <p class="mt-2 max-w-[680px] text-base leading-6 text-[var(--text-secondary)]">
            Marca las facturas de las que {{ member.name }} será responsable. Una factura solo puede
            tener un responsable: al asignarla, deja de estar a cargo de quien la tenga ahora.
          </p>
        </header>

        <section class="mt-12 overflow-hidden rounded border border-[var(--border-default)] bg-white">
          <h2 class="sr-only">Facturas disponibles</h2>
          <ul class="m-0 flex list-none flex-col p-0" aria-label="Facturas disponibles">
            <li
              v-for="bill in availableBills"
              :key="bill.id"
              class="flex min-h-[69px] items-center gap-4 border-b px-5 last:border-b-0"
              :class="{
                'bg-[var(--color-warning-100)]': bill.tone === 'warning',
                'bg-[var(--color-success-100)]': bill.tone === 'success',
                'border-[var(--color-warning-500)]': bill.id === 'epm',
                'border-[var(--color-accent-default)]': bill.id === 'internet',
                'border-[var(--border-default)]': bill.id === 'carro' || bill.id === 'arriendo',
              }"
            >
              <input
                :id="bill.id"
                :checked="bill.checked"
                type="checkbox"
                class="bill-checkbox h-5 w-5"
              />
              <label :for="bill.id" class="flex flex-1 cursor-pointer items-center justify-between gap-4">
                <span>
                  <span class="block text-sm font-medium leading-5">{{ bill.name }}</span>
                  <span class="mt-1 block text-sm leading-5" :class="bill.tone === 'warning' ? 'text-[var(--color-warning-900)]' : 'text-[var(--text-secondary)]'">
                    {{ bill.detail }}
                  </span>
                </span>
                <span class="text-right text-sm leading-5" :class="bill.tone === 'warning' ? 'text-[var(--color-warning-900)]' : 'text-[var(--text-secondary)]'">
                  {{ bill.assignee }}
                </span>
              </label>
            </li>
          </ul>
        </section>

        <div class="mt-12 flex justify-end gap-3">
          <AppButton variant="secondary" class="w-40" @click="returnToGroup">Cancelar</AppButton>
          <AppButton
            variant="primary"
            class="w-[200px] rounded-full border border-[var(--action-primary)] !text-[var(--color-secondary-500)]"
            @click="returnToGroup"
          >
            Actualizar
          </AppButton>
        </div>
      </article>
    </main>
  </div>
</template>

<style scoped>
.bill-checkbox {
  appearance: none;
  flex: 0 0 auto;
  border: 1px solid var(--color-secondary-700);
  border-radius: 2px;
  background-color: #ffffff;
  cursor: pointer;
}

.bill-checkbox:checked {
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='m3 8 3 3 7-7' fill='none' stroke='%23000449' stroke-linecap='round' stroke-linejoin='round' stroke-width='2.8'/%3E%3C/svg%3E");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 14px 14px;
}
</style>
