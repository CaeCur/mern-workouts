// model
const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");

// get all workouts
const getWorkouts = async (req, res) => {
  const user_id = req.user._id;

  try {
    const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(workouts);
  } catch (err) {
    res.status(400).json({ errorMessage: err.message });
  }
};

//get single workout
const getWorkout = async (req, res) => {
  const { id } = req.params;

  // mongo ID is specifically a 12 byte string or 24 character hex string
  // let's validate that the id is a valid mongo ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ errorMessage: "Invalid ID" });
  }

  const workout = await Workout.findById(id);

  if (!workout) {
    return res.status(404).json({ errorMessage: "Workout not found" });
  }

  res.status(200).json(workout);
};

//create new workout
const createWorkout = async (req, res) => {
  const { title, reps, load } = req.body;
  const emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (!reps) {
    emptyFields.push("reps");
  }
  if (!load) {
    emptyFields.push("load");
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({
      errorMessage: "Missing fields: " + emptyFields.join(", "),
      missingFields: emptyFields,
    });
  }

  //add workout to DB
  try {
    const user_id = req.user._id; //in the auth middleware, we add user to req
    const workout = await Workout.create({
      title,
      reps,
      load,
      user_id,
    });
    res.status(200).json(workout);
  } catch (err) {
    res.status(400).json({ errorMessage: err.message });
  }
};

//update workout
const updateWorkout = async (req, res) => {
  const { id } = req.params;

  //validate id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ errorMessage: "Invalid ID" });
  }

  const workout = await Workout.findByIdAndUpdate(id, {
    ...req.body,
  });

  if (!workout) {
    return res.status(404).json({ errorMessage: "Workout not found" });
  }

  res.status(200).json(workout);
};

//delete workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  //validate id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ errorMessage: "Invalid ID" });
  }

  const workout = await Workout.findByIdAndDelete(id);

  if (!workout) {
    return res.status(404).json({ errorMessage: "Workout not found" });
  }

  res.status(200).json(workout);
};

module.exports = { getWorkouts, getWorkout, createWorkout, updateWorkout, deleteWorkout };
