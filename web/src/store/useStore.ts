import create from 'zustand'
import { Task, Project, Status } from '../types'
import dayjs from 'dayjs'

type TodoRow = Task & { projectTitle: string; parentTitle?: string }

type State = {
  statuses: Status[]
  projects: Project[]
  tasks: Task[]
  capacityMinutes: number
  showOverflow: boolean
  toggleDone: (taskId: string) => void
  addWorkMinutes: (taskId: string, minutes: number) => void
  setCapacityMinutes: (minutes: number) => void
  toggleShowOverflow: () => void
  getVisibleTodos: () => TodoRow[]
}

const sampleStatuses: Status[] = [
  { id: 's-1', name: '未整理', is_done: false, is_wait: false },
  { id: 's-2', name: '対応中', is_done: false, is_wait: false },
  { id: 's-3', name: '完了', is_done: true, is_wait: false },
  { id: 's-4', name: '待ち', is_done: false, is_wait: true }
]

const sampleProjects: Project[] = [
  { id: 'p-1', title: '問合せ #1234' },
  { id: 'p-2', title: '開発: 新機能A' }
]

const sampleTasks: Task[] = [
  {
    id: 't-1',
    projectId: 'p-1',
    title: 'DBスクリプト出荷',
    statusId: 's-1',
    isLeaf: false
  },
  {
    id: 't-1-1',
    projectId: 'p-1',
    parentId: 't-1',
    title: 'スクリプト修正（レビュー指摘対応）',
    statusId: 's-2',
    isLeaf: true,
    dueDate: dayjs().add(0, 'day').format('YYYY-MM-DD'),
    estimatedMinutes: 60
  },
  {
    id: 't-2',
    projectId: 'p-2',
    title: 'リリースノート作成',
    statusId: 's-1',
    isLeaf: true,
    dueDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    estimatedMinutes: 30
  },
  {
    id: 't-3',
    projectId: 'p-2',
    title: '緊急バグ修正',
    statusId: 's-2',
    isLeaf: true,
    dueDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    estimatedMinutes: 120
  },
  {
    id: 't-4',
    projectId: 'p-2',
    title: '設計メモ',
    statusId: 's-4',
    isLeaf: true
  }
]

export const useStore = create<State>((set, get) => ({
  statuses: sampleStatuses,
  projects: sampleProjects,
  tasks: sampleTasks,
  capacityMinutes: 8 * 60,
  showOverflow: false,
  toggleDone: (taskId: string) => {
    set((state) => {
      const doneStatus = state.statuses.find((s) => s.is_done)
      if (!doneStatus) return state
      const tasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, statusId: doneStatus.id } : t
      )
      return { ...state, tasks }
    })
  },
  addWorkMinutes: (taskId: string, minutes: number) => {
    // For demo we just subtract estimatedMinutes as if logged
    set((state) => {
      const tasks = state.tasks.map((t) =>
        t.id === taskId
          ? { ...t, estimatedMinutes: Math.max(0, (t.estimatedMinutes || 0) - minutes) }
          : t
      )
      return { ...state, tasks }
    })
  },
  setCapacityMinutes: (minutes: number) => {
    set(() => ({ capacityMinutes: minutes }))
  },
  toggleShowOverflow: () => {
    set((s) => ({ showOverflow: !s.showOverflow }))
  },
  getVisibleTodos: () => {
    const state = get()
    const statusesById = new Map(state.statuses.map((s) => [s.id, s]))
    // Filter: isLeaf && not done && not wait
    const rows = state.tasks
      .filter((t) => t.isLeaf)
      .filter((t) => {
        const st = statusesById.get(t.statusId)
        if (!st) return true
        if (st.is_done) return false
        if (st.is_wait) return false
        return true
      })
      .map((t) => {
        const project = state.projects.find((p) => p.id === t.projectId)
        const parent = state.tasks.find((pt) => pt.id === t.parentId)
        return { ...t, projectTitle: project?.title ?? '—', parentTitle: parent?.title }
      })

    // Sorting: overdue -> today -> tomorrow -> others (then by estimatedMinutes desc)
    const now = dayjs()
    function key(t: TodoRow) {
      if (!t.dueDate) return 4
      const d = dayjs(t.dueDate)
      if (d.isBefore(now, 'day')) return 0
      if (d.isSame(now, 'day')) return 1
      if (d.isSame(now.add(1, 'day'), 'day')) return 2
      return 3
    }

    rows.sort((a, b) => {
      const ak = key(a)
      const bk = key(b)
      if (ak !== bk) return ak - bk
      // fallback: project with nearer due date
      const ad = a.dueDate ? dayjs(a.dueDate).valueOf() : Number.MAX_SAFE_INTEGER
      const bd = b.dueDate ? dayjs(b.dueDate).valueOf() : Number.MAX_SAFE_INTEGER
      if (ad !== bd) return ad - bd
      return (b.estimatedMinutes || 0) - (a.estimatedMinutes || 0)
    })

    return rows
  }
}))
