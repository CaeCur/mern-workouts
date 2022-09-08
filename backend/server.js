require("dotenv").config();
const express = require("express");
const workoutRoutes = require("./routes/workoutRoutes");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");

//express app
const app = express();

//middleware
app.use(express.json()); // any request that comes in will be parsed for a body, which is passed to the req object

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

//connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    //listen on port 3000
    app.listen(process.env.PORT, () => {
      console.log(`Connected to DB  & listening on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
