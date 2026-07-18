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
    <div className="min-h-screen bg-branddark-bg text-zinc-100 flex flex-col font-sans">
      {/* Header bar */}
      <header className="border-b border-branddark-border bg-branddark-card sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-branddark-input border border-branddark-border rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              AetherBook 
              <span className="text-[9px] px-1.5 py-0.5 bg-zinc-900 text-zinc-300 rounded border border-branddark-border font-mono font-bold uppercase tracking-wider">
                Student
              </span>
            </h1>
            <p className="text-[10px] text-branddark-muted">{studentEmail}</p>
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
        {/* Top Info Header and Search Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Lecture Hall Schedules</h2>
            <p className="text-[11px] text-branddark-muted mt-0.5">Read-only view of active reservations and lecture schedules.</p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
              <svg className="w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search room or lecturer..."
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-branddark-input border border-branddark-border text-white text-xs focus:outline-none focus:border-zinc-500 transition-colors placeholder-zinc-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Dashboard quick statistics widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-branddark-card border border-branddark-border rounded-md p-3.5 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded bg-zinc-900 border border-branddark-border flex items-center justify-center text-zinc-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] uppercase font-mono tracking-wider text-branddark-muted">Total Bookings</p>
              <h3 className="text-base font-bold text-white">{bookings.length}</h3>
            </div>
          </div>

          <div className="bg-branddark-card border border-branddark-border rounded-md p-3.5 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded bg-zinc-900 border border-branddark-border flex items-center justify-center text-zinc-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] uppercase font-mono tracking-wider text-branddark-muted">Active Booked Rooms</p>
              <h3 className="text-base font-bold text-white">{activeRoomsCount}</h3>
            </div>
          </div>
        </section>

        {/* Data Table */}
        <div className="bg-branddark-card border border-branddark-border rounded-md overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-center">
                <p className="text-xs text-branddark-muted">No classroom schedule reservations found.</p>
              </div>
            ) : (
              <table className="w-full text-xs text-left text-zinc-300">
                <thead className="text-[9px] uppercase font-mono bg-branddark-input/50 text-branddark-muted border-b border-branddark-border select-none">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-bold tracking-wider">Lecture Room</th>
                    <th scope="col" className="px-4 py-2.5 font-bold tracking-wider">Reserved Date</th>
                    <th scope="col" className="px-4 py-2.5 font-bold tracking-wider">Time Duration</th>
                    <th scope="col" className="px-4 py-2.5 font-bold tracking-wider">Booked By (Lecturer)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-branddark-border/60">
                  {filteredBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-branddark-input/20 transition-colors"
                    >
                      <td className="px-4 py-2.5 font-semibold text-white">
                        {booking.roomName}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="px-2 py-0.5 bg-brandgold/10 text-brandgold border border-brandgold/20 rounded font-mono text-[10px]">
                          {booking.date}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-zinc-200 font-mono">
                        {booking.start_time} - {booking.end_time}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-400 font-mono">
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