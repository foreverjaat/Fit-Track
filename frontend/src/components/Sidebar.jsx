import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MdDashboard, MdFitnessCenter, MdTrendingUp,
  MdPerson, MdLogout,
} from "react-icons/md";

const navLinks = [
  { path: "/dashboard", label: "Dashboard", icon: <MdDashboard size={20} /> },
  { path: "/workouts",  label: "Workouts",  icon: <MdFitnessCenter size={20} /> },
  { path: "/progress",  label: "Progress",  icon: <MdTrendingUp size={20} /> },
  { path: "/profile",   label: "Profile",   icon: <MdPerson size={20} /> },
];

const goalLabels = {
  lose_weight:        "Lose Weight",
  build_muscle:       "Build Muscle",
  stay_fit:           "Stay Fit",
  increase_endurance: "Increase Endurance",
};

export default function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (setOpen) setOpen(false); 
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      {/* logo*/}
      <div className="sidebar-brand">
        <div className="brand-icon">💪</div>
        <h2>Fit-Track</h2>
      </div>

      {/* Nav — Main */}
      <span className="nav-section">Main</span>
      {navLinks.slice(0, 3).map((link) => (
        <button
          key={link.path}
          className={`nav-item ${location.pathname === link.path ? "active" : ""}`}
          onClick={() => handleNavigate(link.path)}
        >
          <span className="nav-icon">{link.icon}</span>
          {link.label}
        </button>
      ))}

      {/* Nav — Account */}
      <span className="nav-section">Account</span>
      {navLinks.slice(3).map((link) => (
        <button
          key={link.path}
          className={`nav-item ${location.pathname === link.path ? "active" : ""}`}
          onClick={() => handleNavigate(link.path)}
        >
          <span className="nav-icon">{link.icon}</span>
          {link.label}
        </button>
      ))}

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg, #f380ce, #fa7ee3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem",
                color: "#000", flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <div>
              <div className="user-card-name">{user?.name}</div>
              <div className="user-card-goal">
                🎯 {goalLabels[user?.goal] || user?.goal || "Stay Fit"}
              </div>
            </div>
          </div>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          <MdLogout style={{ verticalAlign: "middle", marginRight: 6 }} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
