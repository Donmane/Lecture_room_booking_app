import { useState } from "react";
import { supabase } from "../../lib/supabase";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const { data: roleData } = await supabase
      .from("allowed_emails")
      .select("role")
      .eq("email", email)
      .single();

    const role = roleData?.role || "student";
    if (role === "admin") window.location.href = "../admin/Admindashboard.jsx";
    else if (role === "lecturer") window.location.href = "../lecturer/Lecturerdashboard.jsx";
    else window.location.href = "../student/Studentdashboard.jsx";
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6">Login</h1>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="w-full p-3 bg-blue-600 text-white rounded font-bold hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
        <p className="text-gray-400 mt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </>
  );
}

export default Login;
