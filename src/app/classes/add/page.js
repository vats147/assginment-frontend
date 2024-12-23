'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../../../components/Layout'
import ProtectedRoute from '../../../components/ProtectedRoute'

export default function AddClass() {
  const [name, setName] = useState('')
  const [teacher, setTeacher] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const token = localStorage.getItem('token')
      const tenantId = localStorage.getItem('tenantId')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/schools/classes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Tenant-ID': tenantId,
        },
        body: JSON.stringify({ name, teacherId:teacher }),
      })

      if (!response.ok) {
        throw new Error('Failed to add class')
      }

      router.push('/classes')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <ProtectedRoute>
      <Layout>
        <h1 className="text-3xl font-bold mb-6">Add Class</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="max-w-md">
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">Class Name</label>
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
            <label htmlFor="teacher" className="block mb-2">Teacher</label>
            <input
              type="text"
              id="teacher"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Add Class
          </button>
        </form>
      </Layout>
    </ProtectedRoute>
  )
}

