import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to School Management System</h1>
      <p className="text-xl mb-8">Manage your school efficiently with our multi-tenant platform.</p>
      <Link href="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Login
      </Link>
    </div>
  )
}
 
