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

    db.Workout.find({})
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        })
})

// GET route to display range of workouts for stats page
app.get("/api/workouts/range", (req, res) => {
    db.Workout.find({}).sort({ day: -1 }).limit(7).populate("exercises")
        .then(dbWorkout => {
            // Sorts days in ascending order for graph display
            dbWorkout.sort((a, b) => a.day - b.day);

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