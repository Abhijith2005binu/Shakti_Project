import { useEffect, useState, useCallback } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

interface OfficialRequest {
  id: number;
  user_id: number;
  reason: string;
  status: string;
  created_at: string;
}

interface Official {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Grievance {
  id: number;
  title: string;
  category: string;
  location: string;
  status: string;
  created_at: string;
}

interface Analytics {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
}

const statusColors: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};

export default function AdminPage() {
  const [requests, setRequests] = useState<OfficialRequest[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const fetchData = useCallback(() => {
    API.get("/admin/grievances")
      .then((res) => setGrievances(res.data))
      .catch(() => navigate("/login"));
    API.get("/admin/analytics")
      .then((res) => setAnalytics(res.data));
    API.get("/requests/official/all")
      .then((res) => setRequests(res.data))
      .catch(() => {});
    API.get("/requests/officials/all")
      .then((res) => setOfficials(res.data))
      .catch(() => {});
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (id: number) => {
    try {
      await API.put(`/requests/official/${id}/approve`);
      fetchData();
    } catch {
      alert("Failed to approve request");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await API.put(`/requests/official/${id}/reject`);
      fetchData();
    } catch {
      alert("Failed to reject request");
    }
  };

  const handleRemoveOfficial = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove ${name} as an official? They will be reverted to citizen.`
    );
    if (!confirmed) return;
    try {
      await API.put(`/requests/officials/${id}/remove`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.detail || "Failed to remove official");
    }
  };

  const handleUpdateStatus = async (id: number) => {
    if (!note) return alert("Please add a note");
    setLoading(true);
    try {
      await API.put(`/admin/grievances/${id}/status`, { status, note });
      setSelectedId(null);
      setNote("");
      fetchData();
    } catch {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hello, {name}</span>
          <button
            onClick={handleLogout}
            className="text-sm underline hover:text-green-200"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6 space-y-6">

        {/* Analytics */}
        {analytics && (
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total", value: analytics.total, color: "bg-blue-50 text-blue-700" },
              { label: "Open", value: analytics.open, color: "bg-red-50 text-red-700" },
              { label: "In Progress", value: analytics.in_progress, color: "bg-yellow-50 text-yellow-700" },
              { label: "Resolved", value: analytics.resolved, color: "bg-green-50 text-green-700" },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`rounded-2xl p-5 shadow text-center ${stat.color}`}
              >
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pending Official Requests */}
        {pendingRequests.length > 0 && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Pending Official Requests
              </h2>
              <span className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">
                {pendingRequests.length} pending
              </span>
            </div>
            <div className="divide-y">
              {pendingRequests.map((req) => (
                <div key={req.id} className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        User ID: {req.user_id}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">{req.reason}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-800"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manage Officials */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Manage Officials
            </h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
              {officials.length} official{officials.length !== 1 ? "s" : ""}
            </span>
          </div>
          {officials.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">
              No officials yet. Approve requests above to add officials.
            </div>
          ) : (
            <div className="divide-y">
              {officials.map((official) => (
                <div key={official.id} className="p-5 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{official.name}</p>
                    <p className="text-sm text-gray-500">{official.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Official since {new Date(official.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveOfficial(official.id, official.name)}
                    className="bg-red-100 text-red-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-red-200 transition"
                  >
                    Remove Official
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Grievances */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              All Grievances
            </h2>
          </div>
          <div className="divide-y">
            {grievances.map((g) => (
              <div key={g.id} className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{g.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {g.category} • {g.location}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(g.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[g.status]}`}
                    >
                      {g.status.replace("_", " ").toUpperCase()}
                    </span>
                    <button
                      onClick={() =>
                        setSelectedId(selectedId === g.id ? null : g.id)
                      }
                      className="text-sm bg-green-700 text-white px-3 py-1 rounded-lg hover:bg-green-800"
                    >
                      Update
                    </button>
                  </div>
                </div>
                {selectedId === g.id && (
                  <div className="mt-4 bg-gray-50 rounded-xl p-4 space-y-3">
                    <select
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                    <textarea
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Add a resolution note..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <button
                      onClick={() => handleUpdateStatus(g.id)}
                      disabled={loading}
                      className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800 disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Update"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}