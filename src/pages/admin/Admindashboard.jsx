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
    <div className="min-h-screen bg-branddark-bg text-zinc-100 flex flex-col font-sans">
      {/* Header bar */}
      <header className="border-b border-branddark-border bg-branddark-card sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-branddark-input border border-branddark-border rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-tight flex items-center gap-1.5">
              AetherBook 
              <span className="text-[9px] px-1.5 py-0.5 bg-zinc-900 text-zinc-300 rounded border border-branddark-border font-mono font-bold uppercase tracking-wider">
                Admin
              </span>
            </h1>
            <p className="text-[10px] text-branddark-muted">{adminEmail}</p>
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

        {/* Overview Stats Widgets */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-branddark-card border border-branddark-border rounded-md p-4 relative overflow-hidden">
            <p className="text-[10px] uppercase font-mono tracking-wider text-branddark-muted">Total Lecture Rooms</p>
            <h3 className="text-xl font-bold text-white mt-1">{rooms.length}</h3>
          </div>
          <div className="bg-branddark-card border border-branddark-border rounded-md p-4 relative overflow-hidden">
            <p className="text-[10px] uppercase font-mono tracking-wider text-branddark-muted">Permitted Accounts</p>
            <h3 className="text-xl font-bold text-white mt-1">{allowedEmails.length}</h3>
          </div>
          <div className="bg-branddark-card border border-branddark-border rounded-md p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-mono tracking-wider text-branddark-muted">System State</p>
              <h3 className="text-sm font-semibold text-white mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Operational
              </h3>
            </div>
            <span className="text-[10px] text-branddark-muted font-mono bg-zinc-900 px-2 py-0.5 rounded border border-branddark-border">v1.0.0</span>
          </div>
        </section>

        {/* Panel Workstations */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Lecture Rooms Panel */}
          <div className="lg:col-span-5 bg-branddark-card border border-branddark-border rounded-md p-5 flex flex-col space-y-4 shadow-sm">
            <div>
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Room Directory
              </h2>
              <p className="text-[11px] text-branddark-muted mt-0.5">Register new lecture halls or inspect existing inventories.</p>
            </div>

            {/* Input Controls */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Room key (e.g. Hall-A)"
                className="flex-1 px-3 py-1.5 rounded-md bg-branddark-input border border-branddark-border text-white placeholder-zinc-750 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <button
                onClick={addRoom}
                className="px-3 bg-white hover:bg-zinc-200 text-black rounded-md font-medium text-xs transition-colors shrink-0"
              >
                Add Room
              </button>
            </div>

            {/* Rooms List */}
            <div className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto space-y-1 bg-branddark-input/10 border border-branddark-border rounded-md p-1.5">
              {rooms.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-xs text-branddark-muted">No classrooms declared yet.</p>
                </div>
              ) : (
                rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-branddark-card border border-branddark-border px-3 py-2 rounded flex items-center justify-between hover:bg-branddark-input/40 transition-colors"
                  >
                    <span className="text-xs font-medium text-white">{room.name}</span>
                    <span className="text-[9px] uppercase font-mono font-bold text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/30">
                      Active
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* User Registry Panel */}
          <div className="lg:col-span-7 bg-branddark-card border border-branddark-border rounded-md p-5 flex flex-col space-y-4 shadow-sm">
            <div>
              <h2 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Access Registry & Privilege Control
              </h2>
              <p className="text-[11px] text-branddark-muted mt-0.5">Manage institutional email clearance list and authorize booking staff permissions.</p>
            </div>

            {/* Input registry controls */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Institutional email address"
                className="flex-1 px-3 py-1.5 rounded-md bg-branddark-input border border-branddark-border text-white placeholder-zinc-750 text-xs focus:outline-none focus:border-zinc-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex gap-2">
                <select
                  className="px-3 py-1.5 rounded-md bg-branddark-input border border-branddark-border text-white text-xs focus:outline-none focus:border-zinc-550 transition-colors cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="lecturer">Lecturer</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  onClick={addEmail}
                  className="px-3 bg-white hover:bg-zinc-200 text-black rounded-md font-medium text-xs transition-colors shrink-0"
                >
                  Grant Access
                </button>
              </div>
            </div>

            {/* Registry List */}
            <div className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto space-y-1 bg-branddark-input/10 border border-branddark-border rounded-md p-1.5">
              {allowedEmails.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-xs text-branddark-muted">No emails authorized yet.</p>
                </div>
              ) : (
                allowedEmails.map((item) => (
                  <div
                    key={item.id}
                    className="bg-branddark-card border border-branddark-border px-3 py-2 rounded flex items-center justify-between hover:bg-branddark-input/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600"></div>
                      <span className="text-xs text-zinc-300 font-mono">{item.email}</span>
                    </div>
                    {item.role === "admin" ? (
                      <span className="text-[9px] uppercase font-mono font-bold text-brandpurple bg-brandpurple/10 border border-brandpurple/20 px-1.5 py-0.5 rounded">
                        Admin
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-mono font-bold text-brandgold bg-brandgold/10 border border-brandgold/20 px-1.5 py-0.5 rounded">
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