'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../../../components/Layout'
import ProtectedRoute from '../../../components/ProtectedRoute'

export default function AddStudent() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [classId, setClassId] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const token = localStorage.getItem('token')
      const tenantId = localStorage.getItem('tenantId')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Tenant-ID': tenantId,
        },
        body: JSON.stringify({ name, email, classId }),
      })

      if (!response.ok) {
        throw new Error('Failed to add student')
      }

      router.push('/students')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <ProtectedRoute>
      <Layout>
        <h1 className="text-3xl font-bold mb-6">Add Student</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="classId" className="block mb-2">Class ID</label>
            <input
              type="text"
              id="classId"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Add Student
          </button>
        </form>
      </Layout>
    </ProtectedRoute>
  )
}

