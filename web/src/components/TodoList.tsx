import React from 'react'
import { useStore } from '../store/useStore'
import TodoItem from './TodoItem'
import dayjs from 'dayjs'

export default function TodoList() {
  const getVisibleTodos = useStore((s) => s.getVisibleTodos)
  const todos = getVisibleTodos()
  const capacityMinutes = useStore((s) => s.capacityMinutes)
  const showOverflow = useStore((s) => s.showOverflow)
  const setCapacityMinutes = useStore((s) => s.setCapacityMinutes)
  const toggleShowOverflow = useStore((s) => s.toggleShowOverflow)

  // Simple capacity marking: accumulate estimatedMinutes and mark overflows
  let acc = 0
  const rows = todos.map((t) => {
    const rem = t.estimatedMinutes ?? 0
    const willAcc = acc + rem
    const over = willAcc > capacityMinutes
    acc = willAcc
    return { ...t, over }
  })

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">TODO一覧</h2>
        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-600">容量</label>
          <select
            value={capacityMinutes}
            onChange={(e) => setCapacityMinutes(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={4 * 60}>4h</option>
            <option value={6 * 60}>6h</option>
            <option value={7 * 60}>7h</option>
            <option value={8 * 60}>8h</option>
          </select>
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={showOverflow} onChange={toggleShowOverflow} />
            <span className="text-sm text-gray-600">超過タスクを表示</span>
          </label>
        </div>
      </div>
      <div className="bg-white border rounded">
          {rows
            .filter((r) => (showOverflow ? true : !r.over))
            .map((r) => (
              <div key={r.id} className={`${r.over ? 'opacity-40' : ''}`}>
                <TodoItem task={r} />
                {r.over && (
                  <div className="px-4 pb-2 text-xs text-gray-500">※ このタスクは本日のキャパシティを超えています</div>
                )}
              </div>
            ))}
        {rows.length === 0 && <div className="p-4 text-gray-500">表示するTODOはありません</div>}
      </div>
    </div>
  )
}
