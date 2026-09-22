<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppButton from '@/components/AppButton.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import { useGroupMembers } from '@/features/group/composables/useGroupMembers'

const router = useRouter()
const accountId = ref('')
const { addMember } = useGroupMembers()

function returnToGroup(): void {
  void router.push({ name: 'group' })
}

function inviteMember(): void {
  addMember('Camila')
  void router.push({ name: 'group' })
}
</script>

<template>
  <div class="min-h-screen min-w-[1120px] bg-[var(--surface-canvas)] text-[var(--text-primary)]">
    <AppSidebar />
    <main class="ml-[var(--sidebar-width)] min-h-screen px-12 py-12">
      <article class="mx-auto w-[504px]">
        <nav class="flex h-5 items-center gap-2 text-sm leading-5" aria-label="Ruta de navegación">
          <button type="button" class="text-[var(--text-secondary)]" @click="returnToGroup">
            Grupo
          </button>
          <span class="text-[var(--color-neutral-500)]" aria-hidden="true">›</span>
          <span class="font-medium" aria-current="page">Invitar miembro</span>
        </nav>

        <header class="mt-6">
          <h1 class="text-[32px] font-medium leading-10">Invitar miembro al grupo</h1>
          <p class="mt-2 text-base leading-6 text-[var(--text-secondary)]">
            Escribe el identificador de la cuenta que quieres sumar. Le enviaremos una invitación
            para que acepte.
          </p>
        </header>

        <form class="mt-12" @submit.prevent="inviteMember">
          <label for="account-id" class="block text-sm font-medium leading-5"
            >Identificador de cuenta</label
          >
          <input
            id="account-id"
            v-model="accountId"
            type="text"
            placeholder="ID público del miembro"
            class="mt-2 h-12 w-full rounded border border-[var(--color-neutral-500)] bg-transparent px-4 text-sm leading-5 placeholder:text-[var(--text-secondary)] focus:border-[var(--border-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)]"
          />

          <div class="mt-12 flex justify-end gap-3">
            <AppButton variant="secondary" class="w-[180px]" @click="returnToGroup">
              Cancelar
            </AppButton>
            <AppButton
              type="submit"
              class="w-[200px] rounded-full border border-[var(--action-primary)] !text-[var(--color-secondary-700)]"
              style="color: #000449"
            >
              Invitar
            </AppButton>
          </div>
        </form>
      </article>
    </main>
  </div>
</template>
 