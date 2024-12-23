'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../../../../components/Layout'
import ProtectedRoute from '../../../../components/ProtectedRoute'

export default function ViewAttendance({ params: paramsPromise }) {
  const [attendance, setAttendance] = useState([])
  const [students, setStudents] = useState([]) // To store student data
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [classId, setClassId] = useState(null)
  const router = useRouter()

  // Unwrap the `params` Promise
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await paramsPromise
      setClassId(resolvedParams.classId)
    }
    unwrapParams()
  }, [paramsPromise])

  // Fetch attendance once classId is resolved
  useEffect(() => {
    if (!classId) return

    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token')
        const tenantId = localStorage.getItem('tenantId')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/schools/attendance/${classId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-ID': tenantId,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch attendance')
        }

        const data = await response.json()
        setAttendance(data.attendance)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching attendance:', error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [classId])

  // Fetch students list
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

        const data = await response.json()
        setStudents(data.students)
      } catch (error) {
        console.error('Error fetching students:', error)
      }
    }

    fetchStudents()
  }, [])

  // Map studentId to student name
  const getStudentName = (studentId) => {
    const student = students.find((s) => s._id === studentId)
    return student ? student.name : 'Unknown'
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">View Attendance</h1>
          <button
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </button>
        </div>
        {loading ? (
          <p>Loading attendance...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : attendance.length === 0 ? (
          <p>No attendance records found for this class.</p>
        ) : (
          <table className="w-full bg-white shadow-md rounded">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
               
                <th className="py-3 px-6 text-left">Student Name</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {attendance.map((record, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                 
                  <td className="py-3 px-6 text-left">
                    {record.records.map((studentRecord) => (
                      <div key={studentRecord._id}>
                        {getStudentName(studentRecord.studentId)}
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {record.records.map((studentRecord) => (
                      <div key={studentRecord._id}>
                        {studentRecord.status}
                      </div>
                    ))}
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
