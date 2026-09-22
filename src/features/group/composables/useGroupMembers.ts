import { computed, reactive, readonly, ref } from 'vue'

import type { GroupMember, GroupState } from '@/features/group/models/member'

const STORAGE_KEY = 'fakto.group-state.v2'
const LEGACY_STORAGE_KEYS = ['fakto.group-state.v1'] as const

const initialState: GroupState = {
  unassignedBillCount: 2,
  members: [
    {
      id: 'rafael',
      name: 'Rafael',
      summary: '2 facturas asignadas · 1 por vencer',
      bills: [
        { id: 'epm', name: 'EPM', status: 'Vence mañana' },
        { id: 'internet', name: 'Internet', status: 'Factura al día' },
      ],
    },
    {
      id: 'daniel',
      name: 'Daniel',
      summary: '1 factura asignada · Ninguna por vencer',
      bills: [{ id: 'factura-daniel', name: 'Factura asignada', status: 'Factura al día' }],
    },
    {
      id: 'luisa',
      name: 'Luisa',
      summary: 'Sin facturas asignadas',
      bills: [],
    },
    {
      id: 'gabriel',
      name: 'Gabriel',
      summary: '2 facturas asignadas · 2 por vencer',
      bills: [
        { id: 'factura-gabriel-1', name: 'Factura asignada 1', status: 'Por vencer' },
        { id: 'factura-gabriel-2', name: 'Factura asignada 2', status: 'Por vencer' },
      ],
    },
  ],
}

function cloneInitialState(): GroupState {
  return {
    unassignedBillCount: initialState.unassignedBillCount,
    members: initialState.members.map((member) => ({
      ...member,
      bills: member.bills.map((bill) => ({ ...bill })),
    })),
  }
}

function isGroupState(value: unknown): value is GroupState {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Partial<GroupState>
  return (
    Number.isInteger(candidate.unassignedBillCount) &&
    (candidate.unassignedBillCount ?? -1) >= 0 &&
    Array.isArray(candidate.members) &&
    candidate.members.every(
      (member) =>
        member &&
        typeof member.id === 'string' &&
        typeof member.name === 'string' &&
        typeof member.summary === 'string' &&
        Array.isArray(member.bills) &&
        member.bills.every(
          (bill) =>
            bill &&
            typeof bill.id === 'string' &&
            typeof bill.name === 'string' &&
            typeof bill.status === 'string',
        ),
    )
  )
}

function loadState(): GroupState {
  if (typeof window === 'undefined') return cloneInitialState()

  try {
    LEGACY_STORAGE_KEYS.forEach((key) => window.localStorage.removeItem(key))
    const storedValue = window.localStorage.getItem(STORAGE_KEY)
    if (!storedValue) return cloneInitialState()

    const parsedValue: unknown = JSON.parse(storedValue)
    return isGroupState(parsedValue) ? parsedValue : cloneInitialState()
  } catch {
    return cloneInitialState()
  }
}

const state = reactive<GroupState>(loadState())
const recentlyAddedMemberId = ref<string | null>(null)

function persistState(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // The in-memory interaction remains usable if browser storage is unavailable.
  }
}

export function useGroupMembers() {
  const members = computed(() => state.members)
  const unassignedBillCount = computed(() => state.unassignedBillCount)

  function findMember(id: string): GroupMember | undefined {
    return state.members.find((member) => member.id === id)
  }

  function deleteMember(id: string): boolean {
    const memberIndex = state.members.findIndex((member) => member.id === id)
    if (memberIndex === -1) return false

    const [deletedMember] = state.members.splice(memberIndex, 1)
    state.unassignedBillCount += deletedMember?.bills.length ?? 0
    persistState()
    return true
  }

  function addMember(name: string): boolean {
    const id = 'camila'
    if (state.members.some((member) => member.id === id)) return false

    state.members.push({
      id,
      name,
      summary: 'Sin facturas asignadas',
      bills: [],
    })
    recentlyAddedMemberId.value = id
    persistState()
    return true
  }

  const recentlyAddedMember = computed(() =>
    state.members.find((member) => member.id === recentlyAddedMemberId.value),
  )

  return {
    members: readonly(members),
    unassignedBillCount: readonly(unassignedBillCount),
    recentlyAddedMember: readonly(recentlyAddedMember),
    addMember,
    findMember,
    deleteMember,
  }
}
