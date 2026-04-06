

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const GOALS = [
  { value: "lose_weight",        label: "Lose Weight" },
  { value: "build_muscle",       label: "Build Muscle" },
  { value: "stay_fit",           label: "Stay Fit" },
  { value: "increase_endurance", label: "Increase Endurance" },
];

export default function AuthPage() {
  const [tab, setTab]       = useState("login");
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

 
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Register form state
  const [regForm, setRegForm] = useState({
    name: "", email: "", password: "",
    age: "", weight: "", height: "",
    gender: "male", goal: "stay_fit",
  });

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      toast.success("Welcome back! 💪");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regForm.name || !regForm.email || !regForm.password) {
      toast.error("Name, email and password are required");
      return;
    }
    if (regForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(regForm);
      toast.success("Account created! Let's go 🚀");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo-emoji">💪</div>
          <h1>Fit-Track</h1>
          <p>Your all-in-one fitness companion</p>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>
            Login
          </button>
          <button className={`auth-tab ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>
            Register
          </button>
        </div>

        {/* ── LOGIN ── */}
        {tab === "login" && (
          <div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleLogin} disabled={loading}>
              {loading ? "Signing in..." : "Sign In →"}
            </button>
            <p className="auth-switch">
              No account?{" "}
              <button onClick={() => setTab("register")}>Register free</button>
            </p>
          </div>
        )}

        {/* ── REGISTER ── */}
        {tab === "register" && (
          <div>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input placeholder=" Enter your name" value={regForm.name} onChange={(e) => setRegForm({ ...regForm, name: e.target.value })} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Age</label>
                <input type="number" placeholder="e.g-20" value={regForm.age} onChange={(e) => setRegForm({ ...regForm, age: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select value={regForm.gender} onChange={(e) => setRegForm({ ...regForm, gender: e.target.value })}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input type="number" placeholder="e.g-70" value={regForm.weight} onChange={(e) => setRegForm({ ...regForm, weight: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input type="number" placeholder="e.g-150" value={regForm.height} onChange={(e) => setRegForm({ ...regForm, height: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Your Goal</label>
              <select value={regForm.goal} onChange={(e) => setRegForm({ ...regForm, goal: e.target.value })}>
                {GOALS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" placeholder="you@example.com" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input type="password" placeholder="Min 6 characters" value={regForm.password} onChange={(e) => setRegForm({ ...regForm, password: e.target.value })} />
            </div>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleRegister} disabled={loading}>
              {loading ? "Creating account..." : "Create Account →"}
            </button>
            <p className="auth-switch">
              Have an account?{" "}
              <button onClick={() => setTab("login")}>Sign in</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
