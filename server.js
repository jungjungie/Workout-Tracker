const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fitness-tracker-db", {
    useNewUrlParser: true,
    useFindAndModify: false
});

// HTML routes
// ========================================================
// GET route to exercise page
app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "public/exercise.html"));
})

// GET route to stats page
app.get("/stats", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/stats.html"));
})

// API routes
// ========================================================
// GET route to display last workout
app.get("/api/workouts", (req, res) => {

    db.Workout.find().populate("exercises")
        .then(dbWorkout => {
            // console.log(dbWorkout)
            let workoutArr = [];

            // Loops through all exercises in workout and adds up total duration
            for (let i = 0; i < dbWorkout.length; i++) {
                let totalDuration = 0;

                for (let j = 0; j < dbWorkout[i].exercises.length; j++) {
                    totalDuration += dbWorkout[i].exercises[j].duration;
                }

                // Rebuilds last workout from db as a new object
                let workoutObj = {
                    day: dbWorkout[i].day,
                    exercises: dbWorkout[i].exercises
                };

                // Adding totalDuration to rebuilt workoutObj
                workoutObj.totalDuration = totalDuration;
                workoutArr.push(workoutObj);

                // console.log(totalDuration);
                // console.log(workoutArr)
            }
            res.json(workoutArr);
        })
        .catch(err => {
            res.json(err);
        })
})

// GET route to display range of workouts for stats page
app.get("/api/workouts/range", (req, res) => {
    db.Workout.find().limit(7).populate("exercises")
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        })
})

// POST route to create new workout
app.post("/api/workouts", (req, res) => {

    db.Workout.create({ day: Date.now() })
        .then(dbWorkout => {
            console.log(dbWorkout);
            res.json(dbWorkout);
        })
        .catch(({ message }) => {
            console.log(message);
        })
})

// PUT route to update workout with a newly created exercise
app.put("/api/workouts/:id", (req, res) => {
    console.log("==================================")
    console.log(req.body)
    console.log(req.params.id)
    console.log("==================================")

    db.Exercise.create(req.body)
        .then(({ _id }) => db.Workout.findOneAndUpdate({ _id: req.params.id }, { $push: { exercises: _id } }, { new: true }))
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
})

// Start the server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});  