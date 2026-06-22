import { useEffect, useState } from "react";
import API from "../api/axios";
import { useParams, Link } from "react-router-dom";

interface Grievance {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  created_at: string;
}

interface Update {
  id: number;
  note: string;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};

export default function TrackPage() {
  const { id } = useParams();
  const [grievance, setGrievance] = useState<Grievance | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);

  useEffect(() => {
    API.get(`/grievances/${id}`).then((res) => setGrievance(res.data));
    API.get(`/grievances/${id}/timeline`).then((res) => setUpdates(res.data));
  }, [id]);

  if (!grievance) return <p className="p-6 text-gray-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Grievance Portal</h1>
        <Link to="/dashboard" className="text-sm underline hover:text-green-200">
          ← Back to Dashboard
        </Link>
      </nav>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {grievance.title}
            </h2>
            <span
              className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[grievance.status]}`}
            >
              {grievance.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
          <p className="text-gray-600 mb-3">{grievance.description}</p>
          <div className="text-sm text-gray-500 space-y-1">
            <p>Category: {grievance.category}</p>
            <p>Location: {grievance.location}</p>
            <p>Submitted: {new Date(grievance.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Status Timeline
          </h3>
          {updates.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No updates yet. Your grievance is being reviewed.
            </p>
          ) : (
            <div className="space-y-4">
              {updates.map((u) => (
                <div key={u.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-green-600 mt-1" />
                    <div className="w-0.5 bg-gray-200 flex-1 mt-1" />
                  </div>
                  <div className="pb-4">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[u.status]}`}
                    >
                      {u.status.replace("_", " ").toUpperCase()}
                    </span>
                    <p className="text-gray-700 text-sm mt-1">{u.note}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(u.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}