'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Layout from '../../../../components/Layout'
import ProtectedRoute from '../../../../components/ProtectedRoute'

export default function EditAttendance() {
  const { classId } = useParams()
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token')
        const tenantId = localStorage.getItem('tenantId')
        const response = await fetch(`http://localhost:3002/api/schools/attendance/${classId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-ID': tenantId,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch attendance')
        }

        const data = await response.json()
        console.log(data.attendance)
        const attendanceRecords = data.attendance[0].records.reduce((acc, record) => {
          acc[record.studentId] = record.status === 'Present'
          return acc
        }, {})

        setStudents([
          { _id: '6768fefa911e52727cd0c86e', name: 'Vatsal' },
          { _id: '6768ff08911e52727cd0c879', name: 'asd' },
        ])
        setAttendance(attendanceRecords)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching attendance:', error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchAttendance()
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
      const response = await fetch(`http://localhost:3002/api/schools/attendance/${classId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Tenant-ID': tenantId,
        },
        body: JSON.stringify({ attendance }),
      })

      if (!response.ok) {
        throw new Error('Failed to update attendance')
      }

      alert('Attendance updated successfully')
    } catch (error) {
      console.error('Error updating attendance:', error)
      setError(error.message)
    }
  }

  return (
    <ProtectedRoute>
      <Layout>
        <h1 className="text-3xl font-bold mb-6">Edit Attendance for Class {classId}</h1>
        {loading ? (
          <p>Loading attendance...</p>
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
                  <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{student.name}</td>
                    <td className="py-3 px-6 text-left">
                      <input
                        type="checkbox"
                        checked={attendance[student._id] || false}
                        onChange={(e) => handleAttendanceChange(student._id, e.target.checked)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Update Attendance
            </button>
          </form>
        )}
      </Layout>
    </ProtectedRoute>
  )
}
