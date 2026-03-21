import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar   from "./components/Sidebar";
import AuthPage  from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Workouts  from "./pages/Workouts";
import Progress  from "./pages/Progress";
import Profile   from "./pages/Profile";

// Wrap protected pages with sidebar layout
const PrivateLayout = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: "#18181f", color: "#f0f0f0", border: "1px solid rgba(255,255,255,0.08)" },
          }}
        />
        <Routes>
          <Route path="/login" element={<AuthPage />} />

          <Route path="/" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
          <Route path="/workouts" element={<PrivateLayout><Workouts /></PrivateLayout>} />
          <Route path="/progress" element={<PrivateLayout><Progress /></PrivateLayout>} />
          <Route path="/profile"  element={<PrivateLayout><Profile /></PrivateLayout>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
