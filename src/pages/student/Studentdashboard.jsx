import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function StudentDashboard() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    const { data: bookingData } = await supabase.from('bookings').select('*')
    const { data: roomData } = await supabase.from('rooms').select('*')

    if (!bookingData || !roomData) return

    const merged = bookingData.map((booking) => ({
      ...booking,
      roomName: roomData.find((room) => room.id === booking.room_id)?.name || 'Unknown'
    }))

    setBookings(merged)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Room Bookings</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {bookings.length === 0 && (
        <p className="text-gray-400">No bookings available yet.</p>
      )}

      <div className="grid gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{booking.roomName}</h2>
              <span className="text-yellow-400 font-bold">{booking.date}</span>
            </div>
            <div className="text-gray-300 mt-2">
              {booking.start_time} - {booking.end_time}
            </div>
            <div className="text-gray-400 text-sm mt-1">
              Booked by: {booking.lecturer_email}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}