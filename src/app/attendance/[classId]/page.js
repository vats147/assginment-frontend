'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Layout from '../../../components/Layout'
import ProtectedRoute from '../../../components/ProtectedRoute'

export default function Attendance() {
  const { classId } = useParams()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attendance, setAttendance] = useState({})

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token')
        const tenantId = localStorage.getItem('tenantId')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/classes/${classId}/students`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-ID': tenantId,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch students')
        }
        const data = await response.json()
        setStudents(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching students:', error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchStudents()
  }, [classId])

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: isPresent,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const tenantId = localStorage.getItem('tenantId')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/attendance/${classId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Tenant-ID': tenantId,
        },
        body: JSON.stringify({ attendance }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit attendance')
      }

      alert('Attendance submitted successfully')
    } catch (error) {
      console.error('Error submitting attendance:', error)
      setError(error.message)
    }
  }

  return (
    <ProtectedRoute>
      <Layout>
        <h1 className="text-3xl font-bold mb-6">Attendance for Class {classId}</h1>
        {loading ? (
          <p>Loading students...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <table className="w-full bg-white shadow-md rounded">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Name</th>
                  <th className="py-3 px-6 text-left">Present</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{student.name}</td>
                    <td className="py-3 px-6 text-left">
                      <input
                        type="checkbox"
                        checked={attendance[student.id] || false}
                        onChange={(e) => handleAttendanceChange(student.id, e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Submit Attendance
            </button>
          </form>
        )}
      </Layout>
    </ProtectedRoute>
  )
}

