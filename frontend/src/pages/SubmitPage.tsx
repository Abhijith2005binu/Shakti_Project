import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const categories = [
  "Water Supply",
  "Roads & Infrastructure",
  "Electricity",
  "Sanitation",
  "Public Safety",
  "Other",
];

export default function SubmitPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Water Supply",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.title || !form.description || !form.location) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    try {
      await API.post("/grievances/", form);
      navigate("/dashboard");
    } catch (err) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(axiosError.response?.data?.detail || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-700 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Grievance Portal</h1>
        <Link to="/dashboard" className="text-sm underline hover:text-green-200">
          ← Back to Dashboard
        </Link>
      </nav>
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Submit a Grievance
        </h2>
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              name="title"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Brief title of your grievance"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleChange}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              name="location"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Area or address"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Describe your grievance in detail..."
              onChange={handleChange}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-700 text-white py-2.5 rounded-lg hover:bg-green-800 transition font-medium disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Grievance"}
          </button>
        </div>
      </div>
    </div>
  );
}