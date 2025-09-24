'use client'

import { useApp } from '@/components/AppProvider'

export default function TestProfilePage() {
  const { user, overdueCount, mentionCount } = useApp()
  
  console.log('TestProfilePage - user:', user)
  console.log('TestProfilePage - overdueCount:', overdueCount)
  console.log('TestProfilePage - mentionCount:', mentionCount)

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900">Test Profile Page</h1>
        <p className="text-gray-600">User: {user ? user.email : 'No user'}</p>
        <p className="text-gray-600">Overdue: {overdueCount}</p>
        <p className="text-gray-600">Mentions: {mentionCount}</p>
      </div>
    </div>
  )
}
