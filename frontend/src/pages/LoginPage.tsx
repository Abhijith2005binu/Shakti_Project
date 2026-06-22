import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("name", res.data.name);
      if (res.data.role === "citizen") {
        navigate("/dashboard");
      } else {
        navigate("/admin");
      }
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center relative overflow-hidden">
      {/* Subtle radial gradient to mimic a clean, airy background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,115,232,0.03)_0,rgba(255,255,255,1)_100%)] pointer-events-none"></div>

      <div className="bg-white p-10 rounded-[32px] w-full max-w-md relative z-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-normal text-black mb-3 tracking-tight">
            Grievance Portal
          </h1>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full bg-gray-50 border border-transparent text-black rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            className="w-full bg-gray-50 border border-transparent text-black rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mb-8 text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-gray-500 font-medium hover:text-black transition-colors"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-800 transition-all font-medium disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div className="mt-4 text-center">
          <Link to="/register" className="inline-block w-full bg-[#F1F3F4] text-black py-4 rounded-full hover:bg-[#E8EAED] transition-all font-medium active:scale-[0.98]">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}