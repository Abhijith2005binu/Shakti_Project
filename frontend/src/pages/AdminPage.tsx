import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

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
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const fetchData = () => {
    API.get("/admin/grievances")
      .then((res) => setGrievances(res.data))
      .catch(() => navigate("/login"));
    API.get("/admin/analytics").then((res) => setAnalytics(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

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