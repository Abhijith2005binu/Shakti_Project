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
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to verify email");
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
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Reset Password
        </h1>
        <p className="text-gray-500 mb-6">
          {step === "email"
            ? "Enter your registered email to reset your password"
            : "Create a new password for your account"}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">
            {success}
          </div>
        )}

        {step === "email" && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
              />
            </div>
            <button
              onClick={handleEmailSubmit}
              disabled={loading}
              className="w-full bg-green-700 text-white py-2.5 rounded-lg hover:bg-green-800 transition font-medium disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Continue"}
            </button>
          </>
        )}

        {step === "reset" && !success && (
          <>
            <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">
              Email verified! Please enter your new password below.
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
              />
            </div>
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-green-700 text-white py-2.5 rounded-lg hover:bg-green-800 transition font-medium disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-green-700 font-medium hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
