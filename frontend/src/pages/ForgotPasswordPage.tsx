import { useState } from "react";
import API from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    setError("");
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/forgot-password", { email });
      setResetToken(res.data.reset_token);
      setStep("reset");
    } catch (err) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(axiosError.response?.data?.detail || "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/reset-password", {
        token: resetToken,
        new_password: newPassword,
      });
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(axiosError.response?.data?.detail || "Failed to reset password");
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
            Reset Password
          </h1>
          <p className="text-gray-500 text-sm">
            {step === "email"
              ? "Enter your registered email to reset your password"
              : "Create a new password for your account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm text-center font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl mb-6 text-sm text-center font-medium">
            {success}
          </div>
        )}

        {step === "email" && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full bg-gray-50 border border-transparent text-black rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
              />
            </div>
            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-800 transition-all font-medium disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? "Verifying..." : "Continue"}
            </button>
          </>
        )}

        {step === "reset" && !success && (
          <>
            <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl mb-6 text-sm text-center font-medium">
              Email verified! Please enter your new password below.
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full bg-gray-50 border border-transparent text-black rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full bg-gray-50 border border-transparent text-black rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all placeholder-gray-400"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
              />
            </div>
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-full hover:bg-gray-800 transition-all font-medium disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="inline-block w-full bg-[#F1F3F4] text-black py-4 rounded-full hover:bg-[#E8EAED] transition-all font-medium active:scale-[0.98]"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
