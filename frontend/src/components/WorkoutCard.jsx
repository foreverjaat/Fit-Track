
import { MdDelete, MdFitnessCenter } from "react-icons/md";

const CAT_COLORS = {
  Chest:      "#ff4d6d",
  Back:       "#00d4ff",
  Legs:       "#def2a5",
  Arms:       "#ff9900",
  Shoulders:  "#a855f7",
  Core:       "#06b6d4",
  Cardio:     "#f43f5e",
  "Full Body":"#10b981",
};

export default function WorkoutCard({ workout, onDelete }) {
  const color = CAT_COLORS[workout.category] || "#888";
  const dateStr = new Date(workout.date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className="workout-card">
      <div className="wc-header">
        <div>
          <div className="wc-title">{workout.title}</div>
          <span
            className="wc-cat"
            style={{ background: color + "22", color }}
          >
            {workout.category}
          </span>
        </div>
        <button className="btn-danger" onClick={() => onDelete(workout._id)}>
          <MdDelete size={18} />
        </button>
      </div>

      <div className="wc-meta">
        <span>🔥 {workout.caloriesBurned} kcal</span>
        <span>⏱ {workout.duration} min</span>
        <span>📅 {dateStr}</span>
      </div>

      {workout.exercises?.length > 0 && (
        <div className="wc-exercises">
          {workout.exercises.slice(0, 3).map((ex, i) => (
            <div key={i} className="wc-ex">
              <MdFitnessCenter
                size={12}
                style={{ verticalAlign: "middle", marginRight: 5, color: "#666" }}
              />
              {ex.name}
              {ex.sets > 0 && ` — ${ex.sets}×${ex.reps}`}
              {ex.weight > 0 && ` @ ${ex.weight}`}
            </div>
          ))}
          {workout.exercises.length > 3 && (
            <div className="wc-ex" style={{ color: "var(--muted)" }}>
              +{workout.exercises.length - 3} more exercises
            </div>
          )}
        </div>
      )}

      {workout.notes && (
        <div className="wc-notes">📝 {workout.notes}</div>
      )}
    </div>
  );
}
