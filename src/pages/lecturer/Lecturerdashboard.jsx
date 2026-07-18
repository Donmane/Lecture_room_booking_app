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

  // Clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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

    // Sort by date then by start time
    merged.sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date);
      if (dateDiff !== 0) return dateDiff;
      return a.start_time.localeCompare(b.start_time);
    });

    setBookings(merged);
  };

  const handleBooking = async () => {
    if (!roomId || !date || !startTime || !endTime) {
      setMessage("Please fill in all fields to complete reservation.");
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
      setMessage("Room reserved successfully!");
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
    <div className="min-h-screen bg-branddark-bg text-zinc-100 flex flex-col font-sans">
      {/* Header bar */}
      <header className="border-b border-branddark-border bg-branddark-card sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-branddark-input border border-branddark-border rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              AetherBook 
              <span className="text-[9px] px-1.5 py-0.5 bg-zinc-900 text-zinc-300 rounded border border-branddark-border font-mono font-bold uppercase tracking-wider">
                Lecturer
              </span>
            </h1>
            <p className="text-[10px] text-branddark-muted">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-2.5 py-1.5 border border-branddark-border text-zinc-400 hover:text-white rounded-md text-xs font-medium hover:bg-zinc-900 transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
        {/* Status notification */}
        {message && (
          <div className="p-3 rounded-md bg-zinc-900 border border-branddark-border text-zinc-300 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brandpurple shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{message}</span>
            </div>
            <button onClick={() => setMessage("")} className="text-branddark-muted hover:text-white transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Booking Form Panel */}
          <div className="lg:col-span-5 bg-branddark-card border border-branddark-border rounded-md p-5 flex flex-col space-y-4 shadow-sm">
            <div>
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reserve a Classroom
              </h2>
              <p className="text-[11px] text-branddark-muted mt-0.5">Submit a reservation slot for any active lecture room below.</p>
            </div>

            <div className="space-y-3">
              {/* Select Room */}
              <div>
                <label className="block text-[10px] font-medium text-branddark-muted uppercase tracking-wider mb-1">Lecture Hall</label>
                <select
                  className="w-full px-3 py-1.5 rounded-md bg-branddark-input border border-branddark-border text-white text-xs focus:outline-none focus:border-zinc-550 transition-colors cursor-pointer"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                >
                  <option value="">Choose a classroom...</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date selection */}
              <div>
                <label className="block text-[10px] font-medium text-branddark-muted uppercase tracking-wider mb-1">Reservation Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-1.5 rounded-md bg-branddark-input border border-branddark-border text-white text-xs focus:outline-none focus:border-zinc-550 transition-colors cursor-pointer"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* Time select range */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium text-branddark-muted uppercase tracking-wider mb-1">Start Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-1.5 rounded-md bg-branddark-input border border-branddark-border text-white text-xs focus:outline-none focus:border-zinc-550 transition-colors cursor-pointer"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-branddark-muted uppercase tracking-wider mb-1">End Time</label>
                  <input
                    type="time"
                    className="w-full px-3 py-1.5 rounded-md bg-branddark-input border border-branddark-border text-white text-xs focus:outline-none focus:border-zinc-550 transition-colors cursor-pointer"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full py-2 bg-white hover:bg-zinc-200 text-black rounded-md font-medium text-xs transition-colors mt-2"
            >
              Book Room Slot
            </button>
          </div>

          {/* Bookings Overview Panel */}
          <div className="lg:col-span-7 bg-branddark-card border border-branddark-border rounded-md p-5 flex flex-col space-y-4 shadow-sm">
            <div>
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendar Schedules
              </h2>
              <p className="text-[11px] text-branddark-muted mt-0.5">Review live bookings list across all campus classrooms.</p>
            </div>

            {/* List */}
            <div className="flex-1 min-h-[300px] max-h-[450px] overflow-y-auto space-y-1.5 bg-branddark-input/10 border border-branddark-border rounded-md p-2">
              {bookings.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-xs text-branddark-muted">No reservations booked on calendar.</p>
                </div>
              ) : (
                bookings.map((booking) => {
                  const isOwnBooking = booking.lecturer_email === userEmail;
                  return (
                    <div
                      key={booking.id}
                      className={`border p-3 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        isOwnBooking 
                          ? "border-brandpurple/30 bg-brandpurple/5" 
                          : "border-branddark-border bg-branddark-card hover:bg-branddark-input/30"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs text-white">{booking.roomName}</span>
                          {isOwnBooking && (
                            <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-brandpurple border border-brandpurple/25 bg-brandpurple/10 px-1 py-0.5 rounded">
                              Mine
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-branddark-muted font-mono">
                          <svg className="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            {booking.start_time} - {booking.end_time}
                          </span>
                        </div>
                        <div className="text-[10px] text-branddark-muted font-mono">
                          By: <span className="text-zinc-300">{booking.lecturer_email}</span>
                        </div>
                      </div>

                      {/* Date badge */}
                      <div className="sm:self-center shrink-0">
                        <span className="px-2 py-0.5 bg-brandgold/10 text-brandgold border border-brandgold/20 rounded font-mono text-[10px] tracking-wide flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {booking.date}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
