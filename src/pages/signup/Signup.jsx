import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    // Check role in allowed_emails table
    const { data: roleData } = await supabase
      .from("allowed_emails")
      .select("role")
      .eq("email", email)
      .single();

    const role = roleData?.role || "student";

    if (role === "admin") {
      window.location.href = "/admin";
    } else if (role === "lecturer") {
      window.location.href = "/lecturer";
    } else {
      window.location.href = "/student";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-branddark-bg p-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brandpurple/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brandgold/5 blur-[120px] pointer-events-none"></div>

      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8 select-none">
        <div className="w-12 h-12 bg-gradient-to-tr from-brandpurple to-brandgold rounded-xl flex items-center justify-center shadow-lg shadow-brandpurple/25 mb-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-100 to-brandgold-light bg-clip-text text-transparent">AETHERBOOK</span>
        <span className="text-xs text-branddark-muted mt-1 uppercase tracking-widest font-bold">Lecture Room Booking System</span>
      </div>

      {/* Main card */}
      <div className="bg-branddark-card border border-branddark-border/60 p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brandpurple/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <h1 className="text-xl font-bold text-white mb-6 tracking-tight">Create Account</h1>
        
        {error && (
          <div className="bg-red-950/40 border border-red-900/60 text-red-200 p-3 rounded-lg text-sm mb-5 flex items-start gap-2.5">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-branddark-muted uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@university.edu"
                className="w-full p-3 rounded-lg bg-branddark-input border border-branddark-border text-white placeholder-gray-600 focus:outline-none focus:border-brandpurple focus:ring-1 focus:ring-brandpurple transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-branddark-muted uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full p-3 rounded-lg bg-branddark-input border border-branddark-border text-white placeholder-gray-600 focus:outline-none focus:border-brandpurple focus:ring-1 focus:ring-brandpurple transition-all duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3.5 bg-gradient-to-r from-brandpurple to-purple-800 hover:from-brandpurple-light hover:to-brandpurple text-white rounded-lg font-semibold tracking-wide shadow-lg shadow-brandpurple/20 transition-all duration-300 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registering...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-branddark-border/60 text-center">
          <p className="text-sm text-branddark-muted">
            Already have an account?{" "}
            <a href="/" className="text-brandgold hover:text-brandgold-light font-semibold transition-colors hover:underline underline-offset-4">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}