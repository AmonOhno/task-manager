export type UUID = string

export type Status = {
  id: UUID
  name: string
  is_done?: boolean
  is_wait?: boolean
}

export type Project = {
  id: UUID
  title: string
}

export type Task = {
  id: UUID
  projectId: UUID
  parentId?: UUID | null
  title: string
  description?: string
  dueDate?: string | null // ISO date
  statusId: UUID
  estimatedMinutes?: number
  isLeaf: boolean
}
