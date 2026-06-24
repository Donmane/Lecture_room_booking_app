import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function LecturerDashboard() {
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetchRooms();
    fetchBookings();
    getUser();
  }, []);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUserEmail(data?.user?.email || "");
  };

  const fetchRooms = async () => {
    const { data } = await supabase.from("rooms").select("*");
    setRooms(data || []);
  };

  const fetchBookings = async () => {
    const { data: bookingData } = await supabase.from("bookings").select("*");
    const { data: roomData } = await supabase.from("rooms").select("*");

    if (!bookingData || !roomData) return;

    // Manually match room names to bookings
    const merged = bookingData.map((booking) => ({
      ...booking,
      roomName:
        roomData.find((room) => room.id === booking.room_id)?.name || "Unknown",
    }));

    setBookings(merged);
  };

  const handleBooking = async () => {
    if (!roomId || !date || !startTime || !endTime) {
      setMessage("Please fill in all fields");
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      room_id: roomId,
      lecturer_email: userEmail,
      date,
      start_time: startTime,
      end_time: endTime,
    });

    if (error) {
      setMessage("Booking failed: " + error.message);
    } else {
      setMessage("Room booked successfully!");
      setRoomId("");
      setDate("");
      setStartTime("");
      setEndTime("");
      fetchBookings();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Lecturer Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {message && <p className="text-green-400 mb-4">{message}</p>}

      {/* Booking Form */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Book a Room</h2>
        <div className="grid grid-cols-2 gap-4">
          <select
            className="p-3 rounded bg-gray-700 text-white col-span-2"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="p-3 rounded bg-gray-700 text-white"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              type="time"
              className="flex-1 p-3 rounded bg-gray-700 text-white"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <input
              type="time"
              className="flex-1 p-3 rounded bg-gray-700 text-white"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={handleBooking}
          className="mt-4 w-full bg-green-600 p-3 rounded font-bold hover:bg-green-700"
        >
          Book Room
        </button>
      </div>

      {/* Bookings List */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">All Bookings</h2>
        {bookings.length === 0 && (
          <p className="text-gray-400">No bookings yet</p>
        )}
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-gray-700 p-4 rounded mb-2">
            <div className="flex justify-between">
              <span className="font-bold">{booking.roomName}</span>
              <span className="text-yellow-400">{booking.date}</span>
            </div>
            <div className="text-gray-300 text-sm mt-1">
              {booking.start_time} - {booking.end_time}
            </div>
            <div className="text-gray-400 text-sm">
              {booking.lecturer_email}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
