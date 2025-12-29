import React from 'react'
import { Task } from '../types'
import dayjs from 'dayjs'
import { useStore } from '../store/useStore'
import Modal from './Modal'
import { useState } from 'react'

type Props = {
  task: Task & { projectTitle: string; parentTitle?: string }
}

export default function TodoItem({ task }: Props) {
  const toggleDone = useStore((s) => s.toggleDone)
  const addWork = useStore((s) => s.addWorkMinutes)
  const statuses = useStore((s) => s.statuses)
  const [open, setOpen] = useState(false)

  const due = task.dueDate ? dayjs(task.dueDate) : null
  const now = dayjs()
  let dueLabel = ''
  let dueClass = ''
  if (due) {
    if (due.isBefore(now, 'day')) {
      dueLabel = '期限超過'
      dueClass = 'text-red-600 font-bold'
    } else if (due.isSame(now, 'day')) {
      dueLabel = '今日'
      dueClass = 'text-orange-600 font-bold'
    } else if (due.isSame(now.add(1, 'day'), 'day')) {
      dueLabel = '明日'
      dueClass = ''
    } else {
      dueLabel = `${due.diff(now, 'day')}日後`
    }
  }

  const priorityColor = () => {
    if (!due) return 'bg-gray-300'
    if (due.isBefore(now, 'day')) return 'bg-red-500'
    if (due.isSame(now, 'day')) return 'bg-orange-400'
    return 'bg-gray-400'
  }

  return (
    <>
      <div className="flex items-center gap-3 p-3 border-b">
        <div className="w-3 h-3 rounded-full " aria-hidden style={{ backgroundColor: undefined }}>
          <span className={`inline-block w-3 h-3 rounded-full ${priorityColor()}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-semibold truncate cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => (e.key === 'Enter' ? setOpen(true) : undefined)}
          >
            {task.title}
          </div>
          <div className="text-sm text-gray-500 truncate">
            {task.parentTitle ? <>{task.parentTitle} ・ </> : null}
            <span className="text-gray-400">{task.projectTitle}</span>
          </div>
        </div>
        <div className="text-sm w-32 text-right">
          {due ? <div className={dueClass}>{dueLabel}</div> : <div className="text-gray-400">期限未設定</div>}
        </div>
        <div className="w-24 text-right">
          <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-800">
            {statuses.find((s) => s.id === task.statusId)?.name ?? ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="完了"
            title="完了"
            className="px-2 py-1 bg-green-100 text-green-800 rounded"
            onClick={() => toggleDone(task.id)}
          >
            ✓
          </button>
          <button
            title="工数入力(+30m)"
            className="px-2 py-1 bg-slate-100 text-slate-800 rounded"
            onClick={() => addWork(task.id, 30)}
          >+30m</button>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-lg font-bold mb-2">{task.title}</h3>
        <div className="text-sm text-gray-600 mb-2">プロジェクト: {task.projectTitle}</div>
        <div className="text-sm text-gray-600 mb-2">親タスク: {task.parentTitle ?? 'なし'}</div>
        <div className="text-sm text-gray-600 mb-2">期限: {task.dueDate ?? '未設定'}</div>
        <div className="text-sm text-gray-600 mb-2">見積: {task.estimatedMinutes ?? 0}分</div>
        <div className="text-right mt-4">
          <button className="px-3 py-1 bg-slate-100 rounded" onClick={() => setOpen(false)}>閉じる</button>
        </div>
      </Modal>
    </>
  )
}
