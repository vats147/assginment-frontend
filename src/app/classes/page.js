'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import ProtectedRoute from '../../components/ProtectedRoute'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token')
        const tenantId = localStorage.getItem('tenantId')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/classes`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-ID': tenantId,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch classes')
        }
        const data = await response.json()
        setClasses(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching classes:', error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchClasses()
  }, [])

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Classes</h1>
          <Link href="/classes/add" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Add Class
          </Link>
        </div>
        {loading ? (
          <p>Loading classes...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Teacher</th>
                <th className="py-3 px-6 text-left">Students</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {classes.map((classItem) => (
                <tr key={classItem.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{classItem.name}</td>
                  <td className="py-3 px-6 text-left">{classItem.teacher}</td>
                  <td className="py-3 px-6 text-left">{classItem.studentCount}</td>
                  <td className="py-3 px-6 text-left">
                    <Link href={`/attendance/${classItem.id}`} className="text-blue-500 hover:underline">
                      Manage Attendance
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Layout>
    </ProtectedRoute>
  )
}

