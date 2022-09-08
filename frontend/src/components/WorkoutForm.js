import { useState } from "react";
import { useWorkoutContext } from "../hooks/useWorkoutContext";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";

export default function WorkoutForm() {
  const { dispatch } = useWorkoutContext();
  const [title, setTitle] = useState("");
  const [reps, setReps] = useState("");
  const [load, setLoad] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to submit a workout");
      return;
    }

    const workout = { title, load, reps };

    const response = await axios
      .post("/api/workouts", workout, { headers: { Authorization: `Bearer ${user.token}` } })
      .catch((err) => {
        if (err.response) {
          const { data } = err.response;
          setError(data.errorMessage);
          setEmptyFields(data.missingFields);
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log("ERROR", err.message);
        }
      });

    if (response && response.status === 200) {
      dispatch({ type: "CREATE_WORKOUT", payload: response.data });
      setError(null);
      setEmptyFields([]);
      setTitle("");
      setReps("");
      setLoad("");
    }
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Workout</h3>

      <label>Excercise Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />

      <label>Number of Repititions:</label>
      <input
        type="Number"
        onChange={(e) => setReps(e.target.value)}
        value={reps}
        className={emptyFields.includes("reps") ? "error" : ""}
      />

      <label>Weight Load (kg):</label>
      <input
        type="Number"
        onChange={(e) => setLoad(e.target.value)}
        value={load}
        className={emptyFields.includes("load") ? "error" : ""}
      />

      <button type="submit">Add Workout</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
}
