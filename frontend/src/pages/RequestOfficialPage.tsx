import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function RequestOfficialPage() {
  const [reason, setReason] = useState("");
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    API.get("/requests/official/my")
      .then((res) => {
        setRequestStatus(res.data.status);
      })
      .catch(() => {
        // No request exists yet — that's fine, show the form
        setRequestStatus(null);
      })
      .finally(() => {
        setLoaded(true);
      });
  }, [navigate]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    if (!reason.trim()) {
      setError("Please provide a reason for your request");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/requests/official", { reason });
      setSuccess(res.data.message);
      setRequestStatus("pending");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Grievance Portal</h1>
          <Link to="/dashboard" className="text-sm underline hover:text-green-200">
            ← Back to Dashboard
          </Link>
        </nav>
        <div className="max-w-xl mx-auto p-6">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Grievance Portal</h1>
        <Link to="/dashboard" className="text-sm underline hover:text-green-200">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Apply to Become an Official
        </h2>

        {/* Already pending */}
        {requestStatus === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-yellow-700 font-semibold text-lg">
              Request Pending ⏳
            </p>
            <p className="text-yellow-600 text-sm mt-2">
              Your request is under review by the admin. You will be notified once approved.
            </p>
          </div>
        )}

        {/* Already approved */}
        {requestStatus === "approved" && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <p className="text-green-700 font-semibold text-lg">
              Request Approved ✅
            </p>
            <p className="text-green-600 text-sm mt-2">
              You are now an official. Please log out and log back in to access the official dashboard.
            </p>
          </div>
        )}

        {/* Rejected — show reason + allow reapply */}
        {requestStatus === "rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center mb-2">
            <p className="text-red-700 font-semibold">Request Rejected ❌</p>
            <p className="text-red-600 text-sm mt-1">
              Your previous request was rejected. You may reapply below.
            </p>
          </div>
        )}

        {/* Show form if no request yet OR if rejected */}
        {(requestStatus === null || requestStatus === "rejected" || requestStatus === "not_requested") && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Why do you want to become an official?
              </label>
              <textarea
                rows={5}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Describe your role, department, and reason for requesting official access..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-700 text-white py-2.5 rounded-lg hover:bg-green-800 transition font-medium disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}