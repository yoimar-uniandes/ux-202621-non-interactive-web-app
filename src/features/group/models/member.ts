export interface MemberBill {
  id: string
  name: string
  status: string
}

export interface GroupMember {
  id: string
  name: string
  summary: string
  bills: MemberBill[]
}

export interface GroupState {
  members: GroupMember[]
  unassignedBillCount: number
}
