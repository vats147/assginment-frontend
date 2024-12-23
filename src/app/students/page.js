'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import ProtectedRoute from '../../components/ProtectedRoute'

export default function Students() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token')
        const tenantId = localStorage.getItem('tenantId')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/schools/students`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-ID': tenantId,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch students')
        }
        const data = await response.json();
        setStudents(data.students)
        setLoading(false)
        
      } catch (error) {
        console.error('Error fetching students:', error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Students</h1>
          <Link href="/students/add" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Add Student
          </Link>
        </div>
        {loading ? (
          <p>Loading students...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Class</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {students?.map((student) => (
                <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{student.name}</td>
                  <td className="py-3 px-6 text-left">{student.email}</td>
                  <td className="py-3 px-6 text-left">{student.class}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Layout>
    </ProtectedRoute>
  )
}

