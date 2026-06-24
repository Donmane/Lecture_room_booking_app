import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function StudentDashboard() {
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  useEffect(() => {
    fetchBookings();
    getStudentUser();
  }, []);

  const getStudentUser = async () => {
    const { data } = await supabase.auth.getUser();
    setStudentEmail(data?.user?.email || "Student");
  };

  const fetchBookings = async () => {
    const { data: bookingData } = await supabase.from("bookings").select("*");
    const { data: roomData } = await supabase.from("rooms").select("*");

    if (!bookingData || !roomData) return;

    const merged = bookingData.map((booking) => ({
      ...booking,
      roomName:
        roomData.find((room) => room.id === booking.room_id)?.name || "Unknown",
    }));

    // Sort by date then start time
    merged.sort((a, b) => {
      const dateDiff = new Date(a.date) - new Date(b.date);
      if (dateDiff !== 0) return dateDiff;
      return a.start_time.localeCompare(b.start_time);
    });

    setBookings(merged);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const filteredBookings = bookings.filter((booking) => {
    const query = searchQuery.toLowerCase();
    return (
      booking.roomName.toLowerCase().includes(query) ||
      booking.lecturer_email.toLowerCase().includes(query) ||
      booking.date.toLowerCase().includes(query)
    );
  });

  const activeRoomsCount = new Set(
    bookings.map((b) => b.roomName).filter((name) => name !== "Unknown")
  ).size;

  return (
    <div className="min-h-screen bg-branddark-bg text-gray-100 flex flex-col font-sans">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brandpurple/5 blur-[120px] pointer-events-none"></div>

      {/* Header bar */}
      <header className="border-b border-branddark-border/80 bg-branddark-card/40 backdrop-blur-md sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-tr from-brandpurple to-brandgold rounded-lg flex items-center justify-center shadow-lg shadow-brandpurple/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              AetherBook <span className="text-xs px-2 py-0.5 bg-brandpurple/10 text-brandpurple-light rounded-full border border-brandpurple/20 font-semibold uppercase">Student</span>
            </h1>
            <p className="text-xs text-branddark-muted">{studentEmail}</p>
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
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6 z-0">
        {/* Top Info Header and Search Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Lecture Hall Schedules</h2>
            <p className="text-xs text-branddark-muted mt-0.5">Read-only view of active reservations and lecture schedules.</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-branddark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search room or lecturer..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-branddark-input border border-branddark-border text-white text-sm focus:outline-none focus:border-brandpurple transition-all placeholder-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Dashboard quick statistics widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-branddark-card border border-branddark-border/60 rounded-xl p-4 flex items-center gap-4 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-brandpurple/10 flex items-center justify-center text-brandpurple">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-branddark-muted tracking-wider">Total Bookings</p>
              <h3 className="text-xl font-extrabold text-white">{bookings.length}</h3>
            </div>
          </div>

          <div className="bg-branddark-card border border-branddark-border/60 rounded-xl p-4 flex items-center gap-4 shadow-md">
            <div className="w-10 h-10 rounded-lg bg-brandgold/10 flex items-center justify-center text-brandgold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-branddark-muted tracking-wider">Active Booked Rooms</p>
              <h3 className="text-xl font-extrabold text-white">{activeRoomsCount}</h3>
            </div>
          </div>
        </section>

        {/* Data Table */}
        <div className="bg-branddark-card border border-branddark-border/60 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center border-t border-branddark-border/40">
                <p className="text-sm text-branddark-muted">No classroom schedule reservations found.</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left text-gray-300">
                <thead className="text-xs uppercase bg-branddark-input/40 text-branddark-muted border-b border-branddark-border/80 select-none">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-bold tracking-wider">Lecture Room</th>
                    <th scope="col" className="px-6 py-4 font-bold tracking-wider">Reserved Date</th>
                    <th scope="col" className="px-6 py-4 font-bold tracking-wider">Time Duration</th>
                    <th scope="col" className="px-6 py-4 font-bold tracking-wider">Booked By (Lecturer)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-branddark-border/40">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-branddark-input/15 transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-white group-hover:text-brandpurple-light transition-colors">
                        {booking.roomName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-brandgold/10 text-brandgold-light border border-brandgold/20 rounded-md font-semibold text-xs tracking-wide">
                          {booking.date}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-200 font-medium tracking-wide">
                        {booking.start_time} - {booking.end_time}
                      </td>
                      <td className="px-6 py-4 text-branddark-muted font-medium text-xs break-all">
                        {booking.lecturer_email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}