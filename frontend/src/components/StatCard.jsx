
export default function StatCard({ label, value, sub, icon, color = "#ef7753" }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top" style={{ "--color": color }} />
      <span className="stat-icon">{icon}</span>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
