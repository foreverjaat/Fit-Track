import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import Sidebar from "./components/Sidebar";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";


const PrivateLayout = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="app-layout">
     
      <div className="mobile-topbar">
        <button
          className={`hamburger-btn ${sidebarOpen ? "open" : ""}`}
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
        <span className="mobile-topbar-brand">💪 Fit-Track</span>
       
        <div style={{ width: 34 }} />
      </div>

    
      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

     
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

     
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
            style: {
              background: "#18181f",
              color: "#f0f0f0",
              border: "1px solid rgba(255,255,255,0.08)",
            },
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />

          <Route
            path="/dashboard"
            element={
              <PrivateLayout>
                <Dashboard />
              </PrivateLayout>
            }
          />
          <Route
            path="/workouts"
            element={
              <PrivateLayout>
                <Workouts />
              </PrivateLayout>
            }
          />
          <Route
            path="/progress"
            element={
              <PrivateLayout>
                <Progress />
              </PrivateLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateLayout>
                <Profile />
              </PrivateLayout>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


