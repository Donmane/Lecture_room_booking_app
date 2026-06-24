import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([])
  const [roomName, setRoomName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('lecturer')
  const [allowedEmails, setAllowedEmails] = useState([])
  const [message, setMessage] = useState('')

  // Fetch rooms and allowed emails when page loads
  useEffect(() => {
    fetchRooms()
    fetchAllowedEmails()
  }, [])

  const fetchRooms = async () => {
    const { data } = await supabase.from('rooms').select('*')
    setRooms(data || [])
  }

  const fetchAllowedEmails = async () => {
    const { data } = await supabase.from('allowed_emails').select('*')
    setAllowedEmails(data || [])
  }

  const addRoom = async () => {
    if (!roomName) return
    const { error } = await supabase.from('rooms').insert({ name: roomName })
    if (!error) {
      setMessage('Room added successfully')
      setRoomName('')
      fetchRooms()
    }
  }

  const addEmail = async () => {
    if (!email) return
    const { error } = await supabase
      .from('allowed_emails')
      .insert({ email, role })
    if (!error) {
      setMessage('Email added successfully')
      setEmail('')
      fetchAllowedEmails()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {message && <p className="text-green-400 mb-4">{message}</p>}

      {/* Add Room Section */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Add Lecture Room</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Room name e.g. LR1"
            className="flex-1 p-3 rounded bg-gray-700 text-white"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            onClick={addRoom}
            className="bg-green-600 px-6 py-3 rounded hover:bg-green-700 font-bold"
          >
            Add Room
          </button>
        </div>

        {/* Rooms List */}
        <div className="mt-4">
          {rooms.map((room) => (
            <div key={room.id} className="bg-gray-700 p-3 rounded mb-2">
              {room.name}
            </div>
          ))}
        </div>
      </div>

      {/* Add Allowed Email Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Manage User Roles</h2>
        <div className="flex gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 p-3 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <select
            className="p-3 rounded bg-gray-700 text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="lecturer">Lecturer</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={addEmail}
            className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700 font-bold"
          >
            Add
          </button>
        </div>

        {/* Allowed Emails List */}
        <div className="mt-4">
          {allowedEmails.map((item) => (
            <div key={item.id} className="bg-gray-700 p-3 rounded mb-2 flex justify-between">
              <span>{item.email}</span>
              <span className="text-yellow-400 capitalize">{item.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}