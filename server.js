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

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fitness-tracker-db", { useNewUrlParser: true });

// GET route to exercise page
app.get("/exercise", (req, res) => {
    res.sendFile(path.join(__dirname, "public/exercise.html"));
})

// POST route to create new workout and exercise
app.post("/api/workouts", async ({ body }, res) => {
    // console.log(body);

    // Creates new workout in db for current date
    await db.Workout.create({ day: Date.now() })
        .then(dbWorkout => {
            console.log(dbWorkout);
        })
        .catch(({ message }) => {
            console.log(message);
        })

    // Creates a new exercise
    await db.Exercise.create(body)
        .then(({ _id }) => db.Workout.findOneAndUpdate({}, { $push: { exercises: _id } }, {
            new: true
        }))
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
})

// PUT route to update exercise
app.put("/api/workouts/:id", (req, res) => {
    console.log(req.body)

    if (req.body.type == "cardio") {
        db.Exercise.updateOne({ _id: req.params.id }, {
            type: req.body.type,
            name: req.body.name,
            duration: req.body.duration,
            distance: req.body.distance
        }, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.json(data);
            }
        });
    }

    if (req.body.type == "resistance") {
        db.Exercise.update({ _id: req.params.id }, {
            type: req.body.type,
            name: req.body.name,
            weight: req.body.weight,
            reps: req.body.reps,
            sets: req.body.sets,
            duration: req.body.duration
        }, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.json(data);
            }
        });
    }
})

// Start the server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});  