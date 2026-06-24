import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("lecturer");
  const [allowedEmails, setAllowedEmails] = useState([]);
  const [message, setMessage] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  // Fetch rooms, allowed emails and admin details when page loads
  useEffect(() => {
    fetchRooms();
    fetchAllowedEmails();
    getAdminUser();
  }, []);

  // Clear notification messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getAdminUser = async () => {
    const { data } = await supabase.auth.getUser();
    setAdminEmail(data?.user?.email || "Admin");
  };

  const fetchRooms = async () => {
    const { data } = await supabase.from("rooms").select("*");
    setRooms(data || []);
  };

  const fetchAllowedEmails = async () => {
    const { data } = await supabase.from("allowed_emails").select("*");
    setAllowedEmails(data || []);
  };

  const addRoom = async () => {
    if (!roomName) return;
    const { error } = await supabase.from("rooms").insert({ name: roomName });
    if (!error) {
      setMessage(`Room "${roomName}" added successfully`);
      setRoomName("");
      fetchRooms();
    } else {
      setMessage(`Error adding room: ${error.message}`);
    }
  };

  const addEmail = async () => {
    if (!email) return;
    const { error } = await supabase
      .from("allowed_emails")
      .insert({ email, role });
    if (!error) {
      setMessage(`Email "${email}" registered as ${role}`);
      setEmail("");
      fetchAllowedEmails();
    } else {
      setMessage(`Error registering email: ${error.message}`);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              AetherBook <span className="text-xs px-2 py-0.5 bg-brandpurple/20 text-brandpurple-light rounded-full border border-brandpurple/30 font-semibold uppercase">Admin</span>
            </h1>
            <p className="text-xs text-branddark-muted">{adminEmail}</p>
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

        {/* Overview Stats Widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-branddark-card border border-branddark-border/60 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brandpurple/5 rounded-full blur-2xl pointer-events-none"></div>
            <p className="text-xs uppercase tracking-wider font-semibold text-branddark-muted">Total Lecture Rooms</p>
            <h3 className="text-3xl font-extrabold text-white mt-2">{rooms.length}</h3>
          </div>
          <div className="bg-branddark-card border border-branddark-border/60 rounded-xl p-5 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brandgold/5 rounded-full blur-2xl pointer-events-none"></div>
            <p className="text-xs uppercase tracking-wider font-semibold text-branddark-muted">Permitted Accounts</p>
            <h3 className="text-3xl font-extrabold text-white mt-2">{allowedEmails.length}</h3>
          </div>
          <div className="bg-branddark-card border border-branddark-border/60 rounded-xl p-5 shadow-lg relative overflow-hidden flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-branddark-muted">System State</p>
              <h3 className="text-lg font-bold text-white mt-2 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brandgold animate-pulse"></span>
                Operational
              </h3>
            </div>
            <span className="text-xs text-branddark-muted font-medium bg-branddark-input px-3 py-1.5 rounded-lg border border-branddark-border">v1.0.0</span>
          </div>
        </section>

        {/* Panel Workstations */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Lecture Rooms Panel */}
          <div className="lg:col-span-5 bg-branddark-card border border-branddark-border/60 rounded-2xl p-6 shadow-xl flex flex-col space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <svg className="w-5 h-5 text-brandpurple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Room Directory
              </h2>
              <p className="text-xs text-branddark-muted mt-1">Register new lecture halls or inspect existing inventories.</p>
            </div>

            {/* Input Controls */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Room key (e.g. Hall-A)"
                className="flex-1 p-3 rounded-lg bg-branddark-input border border-branddark-border text-white placeholder-gray-600 focus:outline-none focus:border-brandpurple focus:ring-1 focus:ring-brandpurple text-sm transition-all"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <button
                onClick={addRoom}
                className="px-5 bg-gradient-to-r from-brandpurple to-purple-800 hover:from-brandpurple-light hover:to-brandpurple text-white rounded-lg font-semibold text-sm tracking-wide shadow-md shadow-brandpurple/10 hover:shadow-brandpurple/20 transition-all flex items-center gap-1.5"
              >
                Add Room
              </button>
            </div>

            {/* Rooms List */}
            <div className="flex-1 min-h-[250px] max-h-[350px] overflow-y-auto space-y-2 pr-1">
              {rooms.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center border border-dashed border-branddark-border/60 rounded-xl p-8 text-center">
                  <p className="text-sm text-branddark-muted">No classrooms declared yet.</p>
                </div>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-branddark-input/40 border border-branddark-border/40 p-3.5 rounded-xl flex items-center justify-between hover:border-brandpurple/30 hover:bg-branddark-input/60 transition-all duration-200 group"
                  >
                    <span className="text-sm font-semibold text-white tracking-wide">{room.name}</span>
                    <span className="text-[10px] uppercase font-bold text-brandpurple bg-brandpurple/10 px-2 py-0.5 rounded-full border border-brandpurple/20">
                      Active
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* User Registry Panel */}
          <div className="lg:col-span-7 bg-branddark-card border border-branddark-border/60 rounded-2xl p-6 shadow-xl flex flex-col space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <svg className="w-5 h-5 text-brandgold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Access Registry & Privilege Control
              </h2>
              <p className="text-xs text-branddark-muted mt-1">Manage institutional email clearance list and authorize booking staff permissions.</p>
            </div>

            {/* Input registry controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Institutional email address"
                className="flex-1 p-3 rounded-lg bg-branddark-input border border-branddark-border text-white placeholder-gray-600 focus:outline-none focus:border-brandpurple focus:ring-1 focus:ring-brandpurple text-sm transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex gap-2">
                <select
                  className="p-3 rounded-lg bg-branddark-input border border-branddark-border text-white text-sm focus:outline-none focus:border-brandpurple transition-all min-w-[120px] cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="lecturer">Lecturer</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={addEmail}
                  className="px-6 bg-gradient-to-r from-brandpurple to-purple-800 hover:from-brandpurple-light hover:to-brandpurple text-white rounded-lg font-semibold text-sm tracking-wide shadow-md shadow-brandpurple/10 hover:shadow-brandpurple/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  Grant Access
                </button>
              </div>
            </div>

            {/* Registry List */}
            <div className="flex-1 min-h-[250px] max-h-[350px] overflow-y-auto space-y-2 pr-1">
              {allowedEmails.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center border border-dashed border-branddark-border/60 rounded-xl p-8 text-center">
                  <p className="text-sm text-branddark-muted">No emails authorized yet.</p>
                </div>
              ) : (
                allowedEmails.map((item) => (
                  <div
                    key={item.id}
                    className="bg-branddark-input/40 border border-branddark-border/40 p-3.5 rounded-xl flex items-center justify-between hover:border-brandgold/20 hover:bg-branddark-input/60 transition-all duration-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-branddark-muted"></div>
                      <span className="text-sm text-gray-200 font-medium tracking-wide">{item.email}</span>
                    </div>
                    {item.role === "admin" ? (
                      <span className="text-[10px] uppercase font-bold text-brandpurple-light bg-brandpurple/20 px-3 py-1 rounded-full border border-brandpurple/30">
                        Admin
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold text-brandgold-light bg-brandgold/15 px-3 py-1 rounded-full border border-brandgold/20">
                        Lecturer
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}