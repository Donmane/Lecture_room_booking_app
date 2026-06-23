import { useState } from 'react'
import { supabase } from "../../lib/supabase";

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Check role in allowed_emails table
    const { data: roleData } = await supabase
      .from('allowed_emails')
      .select('role')
      .eq('email', email)
      .single()

    const role = roleData?.role || 'student'

    if (role === 'admin') window.location.href = '/admin'
    else if (role === 'lecturer') window.location.href = '/lecturer'
    else window.location.href = '/student'
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">Sign Up</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white rounded font-bold hover:bg-green-700"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-gray-400 mt-4 text-center">
          Already have an account?{' '}
          <a href="/" className="text-blue-400 hover:underline">Login</a>
        </p>
      </div>
    </div>
  )
}