import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

interface Grievance {
  id: number;
  title: string;
  category: string;
  location: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};

export default function DashboardPage() {
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  useEffect(() => {
    API.get("/grievances/my")
      .then((res) => setGrievances(res.data))
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Grievance Portal</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">Hello, {name}</span>
          <Link
            to="/submit"
            className="bg-white text-green-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-50"
          >
            + New Grievance
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm underline hover:text-green-200"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          My Grievances
        </h2>
        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && grievances.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-400 shadow">
            <p className="text-lg">No grievances submitted yet.</p>
            <Link
              to="/submit"
              className="mt-4 inline-block bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
            >
              Submit your first grievance
            </Link>
          </div>
        )}
        <div className="space-y-4">
          {grievances.map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {g.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {g.category} • {g.location}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(g.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[g.status]}`}
                >
                  {g.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <Link
                to={`/track/${g.id}`}
                className="mt-3 inline-block text-sm text-green-700 font-medium hover:underline"
              >
                View details →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}