import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import toast from "react-hot-toast";
import API from "../api/axios";
import WorkoutCard from "../components/WorkoutCard";

const CATEGORIES = ["Chest", "Back", "Legs", "Arms", "Shoulders", "Core", "Cardio", "Full Body"];

const initForm = {
  title: "", category: "Chest",
  caloriesBurned: "", duration: "",
  notes: "", exercises: [],
};
const initEx = { name: "", sets: "", reps: "", weight: "" };

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initForm);
  const [exForm, setExForm] = useState(initEx);
  const [saving, setSaving] = useState(false);

  const fetchWorkouts = async (cat = "") => {
    setLoading(true);
    try {
      const params = cat ? `?category=${cat}` : "";
      const { data } = await API.get(`/workouts${params}`);
      setWorkouts(data.workouts);
    } catch {
      toast.error("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkouts(); }, []);

  const handleFilter = (cat) => {
    setFilter(cat);
    fetchWorkouts(cat);
  };

  const addExercise = () => {
    if (!exForm.name.trim()) { toast.error("Enter exercise name"); return; }
    setForm((p) => ({ ...p, exercises: [...p.exercises, { ...exForm }] }));
    setExForm(initEx);
  };

  const removeExercise = (idx) => {
    setForm((p) => ({ ...p, exercises: p.exercises.filter((_, i) => i !== idx) }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Workout title is required"); return; }
    setSaving(true);
    try {
      const { data } = await API.post("/workouts", form);
      setWorkouts((p) => [data, ...p]);
      setShowModal(false);
      setForm(initForm);
      toast.success("Workout logged! 💪");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/workouts/${id}`);
      setWorkouts((p) => p.filter((w) => w._id !== id));
      toast.success("Workout deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="fade-up">
      {/* Header */}
      <div className="page-header">
        <div className="page-title">
          <h1>WORKOUTS</h1>
          <p>Track your training sessions</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <MdAdd size={18} /> Log Workouts
        </button>
      </div>

      <div className="page-body">
        {/* Filter bar */}
        <div className="filter-bar">
          <button className={`filter-btn ${filter === "" ? "active" : ""}`} onClick={() => handleFilter("")}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c} className={`filter-btn ${filter === c ? "active" : ""}`} onClick={() => handleFilter(c)}>{c}</button>
          ))}
        </div>

        {/* Workouts grid */}
        {loading ? (
          <div className="loading-container"><div className="spinner" /></div>
        ) : (
          <div className="workouts-grid">
            {workouts.length > 0 ? (
              workouts.map((w) => (
                <WorkoutCard key={w._id} workout={w} onDelete={handleDelete} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏋️</div>
                <h3>No workouts yet</h3>
                <p>Log your first workout to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Workout Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">LOG WORKOUT</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="form-group">
              <label className="form-label">Workout Title *</label>
              <input placeholder="e.g. Morning Push Day" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duration (min)</label>
                <input type="number" placeholder="60" value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Calories Burned</label>
                <input type="number" placeholder="400" value={form.caloriesBurned}
                  onChange={(e) => setForm({ ...form, caloriesBurned: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <input placeholder="Optional notes..." value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>

            {/* Exercise Builder */}
            <div className="exercise-box">
              <div className="exercise-box-title">Add Exercises</div>
              <div className="exercise-grid">
                <input placeholder="Exercise name" value={exForm.name}
                  onChange={(e) => setExForm({ ...exForm, name: e.target.value })} />
                <input type="number" placeholder="Sets" value={exForm.sets}
                  onChange={(e) => setExForm({ ...exForm, sets: e.target.value })} />
                <input type="number" placeholder="Reps" value={exForm.reps}
                  onChange={(e) => setExForm({ ...exForm, reps: e.target.value })} />
                {/*<input type="number" placeholder="kg" value={exForm.weight} onChange={(e) => setExForm({ ...exForm, weight: e.target.value })} />*/}
                <select
                  value={exForm.weight}
                  onChange={(e) => setExForm({ ...exForm, weight: e.target.value })}> 
                  <option value="Weight">Weight</option>
                  <option value="Light">Light</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Heavy">Heavy</option>
                </select>
              </div>
              <button className="btn-secondary" onClick={addExercise}>+ Add Exercise</button>

              {form.exercises.map((ex, i) => (
                <div key={i} className="ex-item">
                  <span>• {ex.name} — {ex.sets}×{ex.reps} @ {ex.weight}</span>
                  <button onClick={() => removeExercise(i)}
                    style={{ background: "none", border: "none", color: "var(--accent2)", cursor: "pointer", fontSize: "0.9rem" }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}
              onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Workout 💪"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
