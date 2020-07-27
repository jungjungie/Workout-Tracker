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

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fitness-tracker-db", { useNewUrlParser: true,
useFindAndModify: false });

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
})

// Start the server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});  