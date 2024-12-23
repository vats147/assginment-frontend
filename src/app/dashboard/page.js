'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import ProtectedRoute from '../../components/ProtectedRoute'

export default function Dashboard() {
  const [schoolData, setSchoolData] = useState(null)

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const token = localStorage.getItem('token')
        const tenantId = localStorage.getItem('tenantId')
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/schools/summary`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'X-Tenant-ID': tenantId,
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch school data')
        }
        const data = await response.json()
        setSchoolData(data)
      } catch (error) {
        console.error('Error fetching school data:', error)
      }
    }

    fetchSchoolData()
  }, [])

  return (
    <ProtectedRoute>
      <Layout>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        {schoolData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">School Name</h2>
              <p>{schoolData.name}</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Total Students</h2>
              <p>{schoolData.totalStudents}</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-xl font-semibold mb-2">Total Classes</h2>
              <p>{schoolData.totalClasses}</p>
            </div>
          </div>
        ) : (
          <p>Loading school data...</p>
        )}
      </Layout>
    </ProtectedRoute>
  )
}

