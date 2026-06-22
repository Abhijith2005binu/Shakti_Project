import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(axiosError.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex items-center justify-center relative overflow-hidden py-10">
      {/* Subtle radial gradient to mimic a clean, airy background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(26,115,232,0.03)_0,rgba(255,255,255,1)_100%)] pointer-events-none"></div>

      <div className="bg-white p-10 rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.04)] w-full max-w-md border border-gray-100 relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-normal text-black mb-3 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm">Register as a citizen or official</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            name="name"
            className="w-full bg-gray-50 border border-transparent text-black rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400"
            placeholder="John Doe"
            onChange={handleChange}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            name="email"
            type="email"
            className="w-full bg-gray-50 border border-transparent text-black rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400"
            placeholder="you@example.com"
            onChange={handleChange}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            name="password"
            type="password"
            className="w-full bg-gray-50 border border-transparent text-black rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400"
            placeholder="••••••••"
            onChange={handleChange}
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            name="role"
            className="w-full bg-gray-50 border border-transparent text-black rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all appearance-none cursor-pointer"
            onChange={handleChange}
          >
            <option value="citizen">Citizen</option>
            <option value="official">Official</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-800 transition-all font-medium disabled:opacity-50 active:scale-[0.98]"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <div className="mt-4 text-center">
          <Link to="/login" className="inline-block w-full bg-[#F1F3F4] text-black py-4 rounded-full hover:bg-[#E8EAED] transition-all font-medium active:scale-[0.98]">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}