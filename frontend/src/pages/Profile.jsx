
import { useState } from "react";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

const GOALS = [
  { value: "lose_weight",        label: "Lose Weight" },
  { value: "build_muscle",       label: "Build Muscle" },
  { value: "stay_fit",           label: "Stay Fit" },
  { value: "increase_endurance", label: "Increase Endurance" },
];

const goalLabel = (val) => GOALS.find((g) => g.value === val)?.label || val;

export default function Profile() {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name:   user?.name   || "",
    age:    user?.age    || "",
    weight: user?.weight || "",
    height: user?.height || "",
    gender: user?.gender || "male",
    goal:   user?.goal   || "stay_fit",
  });

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  // Compute BMI
  const bmi = form.weight && form.height
    ? (form.weight / Math.pow(form.height / 100, 2)).toFixed(1)
    : null;

  const bmiStatus = bmi
    ? bmi < 18.5 ? "⚠️ Underweight"
    : bmi < 25   ? "✅ Normal weight"
    : bmi < 30   ? "⚠️ Overweight"
    :               "❌ Obese"
    : null;

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const { data } = await API.put("/auth/update", form);
      updateUser(data);
      toast.success("Profile updated! ✅");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast.error("Fill in all fields"); return; }
    if (pwForm.newPassword.length < 6) { toast.error("New password must be 6+ characters"); return; }
    if (pwForm.newPassword !== pwForm.confirm) { toast.error("Passwords do not match"); return; }
    setSavingPw(true);
    try {
      await API.put("/auth/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      toast.success("Password changed! 🔒");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-title">
          <h1>PROFILE</h1>
          <p>Manage your account</p>
        </div>
      </div>

      <div className="page-body">
        <div className="profile-layout">
          {/* Left: Avatar card */}
          <div>
            <div className="profile-sidebar-card">
              <div className="avatar-circle">{initials}</div>
              <div className="profile-name">{user?.name}</div>
              <div className="profile-email">{user?.email}</div>
              <div className="goal-badge">🎯 {goalLabel(user?.goal)}</div>

              {bmi && (
                <div className="bmi-card">
                  <div className="bmi-label">BMI Score</div>
                  <div className="bmi-value">{bmi}</div>
                  <div className="bmi-label">{bmiStatus}</div>
                </div>
              )}

              {/* Quick stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "1rem" }}>
                {[
                  { label: "Weight", value: form.weight ? `${form.weight} kg` : "—" },
                  { label: "Height", value: form.height ? `${form.height} cm` : "—" },
                  { label: "Age",    value: form.age || "—" },
                  { label: "Gender", value: form.gender || "—" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "var(--surface)", borderRadius: 10, padding: "10px 12px", textAlign: "left" }}>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</div>
                    <div style={{ fontWeight: 700, marginTop: 3 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Forms */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Edit Profile */}
            <div className="profile-form-card">
              <h3>Edit Profile</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Weight (kg)</label>
                  <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Height (cm)</label>
                  <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Goal</label>
                  <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
                    {GOALS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Change Password */}
            <div className="profile-form-card">
              <h3>Change Password</h3>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" value={pwForm.newPassword}
                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" value={pwForm.confirm}
                    onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} />
                </div>
              </div>
              <button className="btn-primary" onClick={handlePasswordChange} disabled={savingPw}>
                {savingPw ? "Updating..." : "Update Password 🔒"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
