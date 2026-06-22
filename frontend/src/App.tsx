import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitPage from "./pages/SubmitPage";
import TrackPage from "./pages/TrackPage";
import AdminPage from "./pages/AdminPage";

function PrivateRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role && userRole !== "admin")
    return <Navigate to="/login" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute role="citizen">
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/submit"
          element={
            <PrivateRoute role="citizen">
              <SubmitPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/track/:id"
          element={
            <PrivateRoute>
              <TrackPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute role="official">
              <AdminPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}