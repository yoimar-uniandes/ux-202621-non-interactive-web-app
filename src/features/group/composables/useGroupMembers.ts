import { computed, reactive, readonly, ref } from 'vue'

import type { GroupMember, GroupState } from '@/features/group/models/member'

// Bump the persisted schema so an empty exploratory state from the prior
// prototype always starts this revision with the mockup's populated group.
const STORAGE_KEY = 'fakto.group-state.v4'
const LEGACY_STORAGE_KEYS = [
  'fakto.group-state.v1',
  'fakto.group-state.v2',
  'fakto.group-state.v3',
] as const

const assignableBills = [
  { id: 'epm', name: 'EPM', status: 'Vence mañana' },
  { id: 'internet', name: 'Internet', status: 'Factura al día' },
  { id: 'carro', name: 'Cuota carro', status: 'Vence en 12 días' },
  { id: 'arriendo', name: 'Arriendo', status: 'Vence en 20 días' },
] as const

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

function formatMemberSummary(bills: GroupMember['bills']): string {
  if (bills.length === 0) return 'Sin facturas asignadas'

  const billLabel = `${bills.length} factura${bills.length === 1 ? '' : 's'} asignada${bills.length === 1 ? '' : 's'}`
  const expiringBillCount = bills.filter(
    (bill) => bill.status === 'Vence mañana' || bill.status === 'Por vencer',
  ).length
  const expiringLabel =
    expiringBillCount === 0 ? 'Ninguna por vencer' : `${expiringBillCount} por vencer`

  return `${billLabel} · ${expiringLabel}`
}

export function useGroupMembers() {
  const members = computed(() => state.members)
  const unassignedBillCount = computed(() => state.unassignedBillCount)
  const billsForAssignment = computed(() =>
    assignableBills.map((bill) => ({
      ...bill,
      assignee: state.members.find((member) =>
        member.bills.some((memberBill) => memberBill.id === bill.id),
      ),
    })),
  )

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

  function updateMemberBillAssignments(memberId: string, selectedBillIds: string[]): boolean {
    const selectedBills = new Set(selectedBillIds)
    const member = findMember(memberId)
    if (!member) return false

    assignableBills.forEach((bill) => {
      const currentAssignee = state.members.find((candidate) =>
        candidate.bills.some((candidateBill) => candidateBill.id === bill.id),
      )
      const isSelected = selectedBills.has(bill.id)

      if (isSelected && currentAssignee?.id !== memberId) {
        if (currentAssignee) {
          currentAssignee.bills = currentAssignee.bills.filter(
            (candidateBill) => candidateBill.id !== bill.id,
          )
          currentAssignee.summary = formatMemberSummary(currentAssignee.bills)
        } else {
          state.unassignedBillCount = Math.max(0, state.unassignedBillCount - 1)
        }

        member.bills.push({ ...bill })
      }

      if (!isSelected && currentAssignee?.id === memberId) {
        member.bills = member.bills.filter((candidateBill) => candidateBill.id !== bill.id)
        state.unassignedBillCount += 1
      }
    })

    member.summary = formatMemberSummary(member.bills)
    persistState()
    return true
  }

  const recentlyAddedMember = computed(() =>
    state.members.find((member) => member.id === recentlyAddedMemberId.value),
  )

  return {
    members: readonly(members),
    unassignedBillCount: readonly(unassignedBillCount),
    billsForAssignment: readonly(billsForAssignment),
    recentlyAddedMember: readonly(recentlyAddedMember),
    addMember,
    findMember,
    deleteMember,
    updateMemberBillAssignments,
  }
}
