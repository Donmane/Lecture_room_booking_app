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
    <div className="min-h-screen bg-branddark-bg text-gray-100 flex flex-col font-sans">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brandpurple/5 blur-[120px] pointer-events-none"></div>

      {/* Header bar */}
      <header className="border-b border-branddark-border/80 bg-branddark-card/40 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-brandpurple to-brandgold rounded-lg flex items-center justify-center shadow-lg shadow-brandpurple/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              AetherBook <span className="text-xs px-2 py-0.5 bg-brandgold/20 text-brandgold-light rounded-full border border-brandgold/30 font-semibold uppercase">Lecturer</span>
            </h1>
            <p className="text-xs text-branddark-muted">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-red-900/50 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-950/30 hover:border-red-800 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8 z-0">
        {/* Status notification */}
        {message && (
          <div className="p-4 rounded-xl bg-brandpurple/10 border border-brandpurple/30 text-brandpurple-light flex items-center justify-between animate-fade-in shadow-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-brandpurple-light shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold tracking-wide">{message}</span>
            </div>
            <button onClick={() => setMessage("")} className="text-branddark-muted hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Booking Form Panel */}
          <div className="lg:col-span-5 bg-branddark-card border border-branddark-border/60 rounded-2xl p-6 shadow-xl flex flex-col space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <svg className="w-5 h-5 text-brandpurple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reserve a Classroom
              </h2>
              <p className="text-xs text-branddark-muted mt-1">Submit a reservation slot for any active lecture room below.</p>
            </div>

            <div className="space-y-4">
              {/* Select Room */}
              <div>
                <label className="block text-xs font-semibold text-branddark-muted uppercase tracking-wider mb-2">Lecture Hall</label>
                <select
                  className="w-full p-3 rounded-lg bg-branddark-input border border-branddark-border text-white text-sm focus:outline-none focus:border-brandpurple transition-all cursor-pointer"
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
                <label className="block text-xs font-semibold text-branddark-muted uppercase tracking-wider mb-2">Reservation Date</label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg bg-branddark-input border border-branddark-border text-white text-sm focus:outline-none focus:border-brandpurple transition-all cursor-pointer"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* Time select range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-branddark-muted uppercase tracking-wider mb-2">Start Time</label>
                  <input
                    type="time"
                    className="w-full p-3 rounded-lg bg-branddark-input border border-branddark-border text-white text-sm focus:outline-none focus:border-brandpurple transition-all cursor-pointer"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-branddark-muted uppercase tracking-wider mb-2">End Time</label>
                  <input
                    type="time"
                    className="w-full p-3 rounded-lg bg-branddark-input border border-branddark-border text-white text-sm focus:outline-none focus:border-brandpurple transition-all cursor-pointer"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              className="w-full p-3.5 mt-2 bg-gradient-to-r from-brandpurple to-purple-800 hover:from-brandpurple-light hover:to-brandpurple text-white rounded-lg font-semibold tracking-wide shadow-lg shadow-brandpurple/20 transition-all duration-300"
            >
              Book Room Slot
            </button>
          </div>

          {/* Bookings Overview Panel */}
          <div className="lg:col-span-7 bg-branddark-card border border-branddark-border/60 rounded-2xl p-6 shadow-xl flex flex-col space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <svg className="w-5 h-5 text-brandgold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendar Schedules
              </h2>
              <p className="text-xs text-branddark-muted mt-1">Review live bookings list across all campus classrooms.</p>
            </div>

            {/* List */}
            <div className="flex-1 min-h-[300px] max-h-[500px] overflow-y-auto space-y-3.5 pr-1">
              {bookings.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center border border-dashed border-branddark-border/60 rounded-xl p-8 text-center">
                  <p className="text-sm text-branddark-muted">No reservations booked on calendar.</p>
                </div>
              ) : (
                bookings.map((booking) => {
                  const isOwnBooking = booking.lecturer_email === userEmail;
                  return (
                    <div
                      key={booking.id}
                      className={`bg-branddark-input/30 border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:border-brandpurple/30 ${
                        isOwnBooking ? "border-brandpurple/20 bg-brandpurple/5" : "border-branddark-border/40"
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-white tracking-tight">{booking.roomName}</span>
                          {isOwnBooking && (
                            <span className="text-[9px] px-1.5 py-0.5 bg-brandpurple/20 text-brandpurple-light border border-brandpurple/30 rounded font-bold uppercase tracking-wider">
                              Mine
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-branddark-muted">
                          <svg className="w-3.5 h-3.5 text-brandpurple/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            {booking.start_time} - {booking.end_time}
                          </span>
                        </div>
                        <div className="text-xs text-branddark-muted select-none">
                          Reserved by: <span className="text-gray-300 font-medium">{booking.lecturer_email}</span>
                        </div>
                      </div>

                      {/* Date badge */}
                      <div className="sm:self-center shrink-0">
                        <span className="px-3.5 py-1.5 bg-brandgold/10 text-brandgold border border-brandgold/20 rounded-lg text-xs font-bold tracking-wide shadow-sm shadow-brandgold/5 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
