<script setup lang="ts">
import { useRouter } from 'vue-router'

import AppButton from '@/components/AppButton.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import EmptyGroupState from '@/features/group/components/EmptyGroupState.vue'
import MemberCard from '@/features/group/components/MemberCard.vue'
import { useGroupMembers } from '@/features/group/composables/useGroupMembers'

const router = useRouter()
const { members, unassignedBillCount, recentlyAddedMember } = useGroupMembers()

function openDeleteMember(memberId: string): void {
  void router.push({ name: 'group-member-delete', params: { memberId } })
}

function openAssignBills(memberId: string): void {
  void router.push({ name: 'group-member-assign', params: { memberId } })
}

function openInviteMember(): void {
  void router.push({ name: 'group-member-invite' })
}
</script>

<template>
  <div class="min-h-screen min-w-[1120px] bg-[var(--surface-canvas)] text-[var(--text-primary)]">
    <AppSidebar />
    <main class="ml-[var(--sidebar-width)] min-h-screen px-12 py-12">
      <div class="mx-auto w-full max-w-[var(--content-width)]">
        <header class="flex h-[72px] items-center justify-between gap-12">
          <div>
            <h1 class="text-[32px] font-medium leading-10">Grupo</h1>
            <p class="mt-2 text-base leading-6 text-[var(--text-secondary)]">
              Administra a cada uno de los miembros de tu grupo.
            </p>
          </div>
          <AppButton v-if="members.length > 0" class="w-[200px]" @click="openInviteMember">
            Agregar miembro
          </AppButton>
        </header>

        <section
          v-if="recentlyAddedMember"
          class="mt-6 flex min-h-[40px] w-full items-center justify-between gap-8 rounded border border-[var(--color-neutral-300)] bg-[var(--color-info-100)] px-5 py-3 text-sm leading-5 text-[var(--color-neutral-700)]"
          aria-label="Miembro agregado"
        >
          <p>
            {{ recentlyAddedMember.name }} se agregó al grupo. Todavía no tiene facturas asignadas.
          </p>
          <button
            type="button"
            class="font-medium text-[var(--color-neutral-700)] underline underline-offset-2"
            @click="openAssignBills(recentlyAddedMember.id)"
          >
            Asignar facturas
          </button>
        </section>

        <template v-if="members.length > 0">
          <section
            class="mt-12 flex min-h-[52px] items-center justify-between gap-8 rounded bg-[var(--surface-inverse)] px-6 py-4 text-sm leading-5 text-white"
            aria-label="Facturas sin responsable"
          >
            <p>{{ unassignedBillCount }} facturas del grupo no tienen responsable.</p>
            <button type="button" class="min-h-5 font-medium underline underline-offset-2">
              Ver facturas sin responsable
            </button>
          </section>

          <section class="mt-12 grid grid-cols-2 gap-6" aria-label="Miembros del grupo">
            <MemberCard
              v-for="member in members"
              :id="member.id"
              :key="member.name"
              :name="member.name"
              :summary="member.summary"
              :highlighted="member.id === 'camila'"
              @assign="openAssignBills"
              @delete="openDeleteMember"
            />
          </section>
        </template>

        <EmptyGroupState v-else class="mt-12" />
      </div>
    </main>
  </div>
</template>
