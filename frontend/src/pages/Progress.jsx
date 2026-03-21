
import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { MdAdd } from "react-icons/md";
import toast from "react-hot-toast";
import API from "../api/axios";

const METRICS = [
  { key: "weight",  label: "Weight",   unit: "kg",  color: "#c8ff00" },
  { key: "bodyFat", label: "Body Fat", unit: "%",   color: "#ff4d6d" },
  { key: "chest",   label: "Chest",    unit: "cm",  color: "#00d4ff" },
  { key: "waist",   label: "Waist",    unit: "cm",  color: "#ff9900" },
  { key: "hips",    label: "Hips",     unit: "cm",  color: "#ec4899" },
  { key: "arms",    label: "Arms",     unit: "cm",  color: "#a855f7" },
];

const initForm = { weight: "", bodyFat: "", chest: "", waist: "", hips: "", arms: "" };

export default function Progress() {
  const [logs, setLogs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeMetric, setActive] = useState("weight");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(initForm);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    API.get("/api/progress")
      .then((res) => setLogs(res.data))
      .catch(() => toast.error("Failed to load progress"))
      .finally(() => setLoading(false));
  }, []);

  const metric = METRICS.find((m) => m.key === activeMetric);

  const chartData = logs
    .filter((l) => l[activeMetric] !== null && l[activeMetric] !== undefined)
    .map((l) => ({
      date: new Date(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: l[activeMetric],
    }));

  const handleSave = async () => {
    if (!form.weight) { toast.error("Weight is required"); return; }
    setSaving(true);
    try {
      const { data } = await API.post("/api/progress", form);
      setLogs((p) => [...p, data]);
      setShowModal(false);
      setForm(initForm);
      toast.success("Progress logged! 📈");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/progress/${id}`);
      setLogs((p) => p.filter((l) => l._id !== id));
      toast.success("Log deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  if (loading) {
    return (
      <div>
        <div className="page-header"><div className="page-title"><h1>PROGRESS</h1></div></div>
        <div className="loading-container"><div className="spinner" /></div>
      </div>
    );
  }

  return (
    <div className="fade-up">
      <div className="page-header">
        <div className="page-title">
          <h1>PROGRESS</h1>
          <p>Body measurements over time</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <MdAdd size={18} /> Log Measurements
        </button>
      </div>

      <div className="page-body">
        <div className="progress-grid">
          {/* Chart */}
          <div className="chart-card">
            <div className="metric-tabs">
              {METRICS.map((m) => (
                <button
                  key={m.key}
                  className={`metric-tab ${activeMetric === m.key ? "active" : ""}`}
                  onClick={() => setActive(m.key)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {chartData.length > 1 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#666", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#18181f", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
                    labelStyle={{ color: "#f0f0f0" }}
                    itemStyle={{ color: metric.color }}
                    formatter={(v) => [`${v} ${metric.unit}`, metric.label]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={metric.color}
                    strokeWidth={2.5}
                    dot={{ fill: metric.color, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--muted)" }}>
                {chartData.length === 0
                  ? "No data yet — log your first measurement!"
                  : "Log at least 2 entries to see a trend"}
              </div>
            )}
          </div>

          {/* Recent logs */}
          <div className="chart-card">
            <h3>Recent Logs</h3>
            {[...logs].reverse().slice(0, 8).map((l) => (
              <div key={l._id} className="prog-log">
                <div>
                  <div className="prog-log-label">
                    {l.weight} kg {l.bodyFat ? `· ${l.bodyFat}%` : ""}
                  </div>
                  <div className="prog-log-date">
                    {new Date(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {l[activeMetric] && (
                    <span className="prog-log-val">{l[activeMetric]} {metric.unit}</span>
                  )}
                  <button
                    onClick={() => handleDelete(l._id)}
                    style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
            {logs.length === 0 && (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No logs yet.</p>
            )}
          </div>
        </div>

        {/* Measurement History Table */}
        {logs.length > 0 && (
          <div className="chart-card">
            <h3>Full Measurement History</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--border)" }}>
                    {["Date","Weight","Body Fat","Chest","Waist","Hips","Arms"].map((h) => (
                      <th key={h} style={{ padding: "8px 6px", textAlign: "left", color: "var(--muted)", fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...logs].reverse().map((l) => (
                    <tr key={l._id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "8px 6px" }}>{new Date(l.date).toLocaleDateString()}</td>
                      <td style={{ padding: "8px 6px", color: "#c8ff00" }}>{l.weight} kg</td>
                      <td style={{ padding: "8px 6px" }}>{l.bodyFat ? `${l.bodyFat}%` : "—"}</td>
                      <td style={{ padding: "8px 6px" }}>{l.chest  ? `${l.chest} cm`  : "—"}</td>
                      <td style={{ padding: "8px 6px" }}>{l.waist  ? `${l.waist} cm`  : "—"}</td>
                      <td style={{ padding: "8px 6px" }}>{l.hips   ? `${l.hips} cm`   : "—"}</td>
                      <td style={{ padding: "8px 6px" }}>{l.arms   ? `${l.arms} cm`   : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Progress Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h2 className="modal-title">Log MEASUREMENTS</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="grid-2">
              {[
                { label: "Weight (kg) *", key: "weight" },
                { label: "Body Fat (%)",  key: "bodyFat" },
                { label: "Chest (cm)",    key: "chest" },
                { label: "Waist (cm)",    key: "waist" },
                { label: "Hips (cm)",     key: "hips" },
                { label: "Arms (cm)",     key: "arms" },
              ].map(({ label, key }) => (
                <div key={key} className="form-group">
                  <label className="form-label">{label}</label>
                  <input type="number" placeholder="0" value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}
              onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Measurements 📈"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
 
