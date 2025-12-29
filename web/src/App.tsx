import React from 'react'
import TodoList from './components/TodoList'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold">Task Manager (Demo)</h1>
        </div>
      </header>
      <main className="p-4">
        <TodoList />
      </main>
    </div>
  )
}
