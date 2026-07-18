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
    <div className="flex flex-col items-center justify-center min-h-screen bg-branddark-bg p-6">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-6 select-none">
        <div className="w-7 h-7 bg-branddark-card border border-branddark-border rounded flex items-center justify-center">
          <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-white leading-none">AetherBook</span>
          <span className="text-[10px] text-branddark-muted tracking-wider mt-0.5">LECTURE ROOM BOOKING</span>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-branddark-card border border-branddark-border p-6 rounded-md w-full max-w-sm shadow-md">
        <h1 className="text-sm font-medium text-white mb-4">Create your account</h1>
        
        {error && (
          <div className="bg-red-950/20 border border-red-900/40 text-red-200 px-3 py-2 rounded-md text-xs mb-4 flex items-start gap-2">
            <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-[10px] font-medium text-branddark-muted uppercase tracking-wider mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@university.edu"
                className="w-full px-3 py-2 rounded-md bg-branddark-input border border-branddark-border text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-branddark-muted uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-md bg-branddark-input border border-branddark-border text-white placeholder-zinc-700 text-sm focus:outline-none focus:border-zinc-500 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-white hover:bg-zinc-200 text-black rounded-md font-medium text-sm transition-colors disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-zinc-500" fill="none" viewBox="0 0 24 24">
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

        <div className="mt-4 pt-4 border-t border-branddark-border text-center">
          <p className="text-xs text-branddark-muted">
            Already have an account?{" "}
            <a href="/" className="text-white hover:underline font-medium transition-all">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}