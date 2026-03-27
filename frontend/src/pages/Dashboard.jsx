
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";

const CAT_COLORS = [
  "#c8ff00","#ff4d6d","#00d4ff","#ff9900","#a855f7","#06b6d4","#f43f5e","#10b981",
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="page-title"><h1>DASHBOARD</h1><p>Loading your stats...</p></div>
        </div>
        <div className="loading-container"><div className="spinner" /></div>
      </div>
    );
  }

  // Build 7-day bar chart data
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const last7Map = {};
  stats?.last7Days?.forEach((d) => { last7Map[d._id] = d.calories; });
  const barData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const key = date.toISOString().split("T")[0];
    return { day: dayNames[date.getDay()], calories: last7Map[key] || 0 };
  });

  const pieData = stats?.categoryBreakdown?.map((c) => ({
    name: c._id, value: c.count,
  })) || [];

  const totalMinutes = stats?.totalDuration || 0;
   const hours = Math.floor(totalMinutes / 60);
   const minutes = totalMinutes % 60;
   let durationLabel = "Training time";
   if (totalMinutes >= 60) {
     durationLabel = "Hours of training";
     } else {
     durationLabel = "Minutes of training";
     }

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-title">
          <h1>DASHBOARD</h1>
          <p>Welcome back, {user?.name?.split(" ")[0]} 👋</p>
        </div>
      </div>

      <div className="page-body">
        {/* Stat Cards */}
        <div className="stats-grid">
          <StatCard label="Total Workouts"  value={stats?.totalWorkouts || 0}     sub="All time sessions"  icon="🏋️" color="#8cf4e4" />
          <StatCard label="This Week"       value={stats?.weekWorkouts || 0}          sub="Sessions logged"    icon="📅" color="#c268ee" />
          <StatCard label="Calories Burned" value={`${(stats?.totalCalories || 0).toLocaleString()}`} sub="Total kcal burned"  icon="🔥" color="#ff4d6d" />
          <StatCard label="Total Duration"  value={`${hours ? `${hours}h ` : ""}${minutes}m`}    sub={durationLabel}  icon="⏱" color="#ff9900" />
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Calories Burned — Last 7 Days</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#18181f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
                  labelStyle={{ color: "#f0f0f0" }}
                  itemStyle={{ color: "#e1efad" }}
                />
                <Bar dataKey="calories" fill="#e0f39f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Category Breakdown</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name }) => name} labelLine={false}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
                    ))}
                  </Pie>6
                  <Tooltip
                    contentStyle={{ background: "#18181f", border: "1px solid rgba(120, 23, 23, 0.08)", borderRadius: 8 }}
                    labelStyle={{ color: "#ee6363" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--muted)" }}>
                No workout data yet
              </div>
            )}
          </div>
        </div>

        {/* Recent Workouts */}
        <div className="chart-card">
          <h3>Recent Workouts</h3>
          {stats?.recentWorkouts?.length > 0 ? (
            stats.recentWorkouts.map((w) => (
              <div key={w._id} className="recent-item">
                <div>
                  <div className="recent-item-title">{w.title}</div>
                  <div className="recent-item-sub">
                    {w.category} · {new Date(w.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span className="recent-item-cal">🔥 {w.caloriesBurned} kcal</span>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>⏱ {w.duration}m</span>
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "var(--muted)", padding: "1rem 0", fontSize: "0.9rem" }}>
              No workouts yet. Start logging! 💪
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
