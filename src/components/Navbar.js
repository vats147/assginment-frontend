import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold">
          School Management
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/students" className="hover:text-gray-300">
              Students
            </Link>
          </li>
          <li>
            <Link href="/classes" className="hover:text-gray-300">
              Classes
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('tenantId')
                window.location.href = '/login'
              }}
              className="hover:text-gray-300"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

