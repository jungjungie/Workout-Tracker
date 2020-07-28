let mongoose = require("mongoose");
let db = require("../models");

mongoose.connect("mongodb://localhost/fitness-tracker-db", {
  useNewUrlParser: true,
  useFindAndModify: false
});

let exerciseSeed = [
  {
    type: "resistance",
    name: "Bicep Curl",
    duration: 20,
    weight: 100,
    reps: 10,
    sets: 4
  },
  {
    type: "resistance",
    name: "Lateral Pull",
    duration: 20,
    weight: 300,
    reps: 10,
    sets: 4
  },
  {
    type: "resistance",
    name: "Push Press",
    duration: 25,
    weight: 185,
    reps: 8,
    sets: 4
  },
  {
    type: "cardio",
    name: "Running",
    duration: 25,
    distance: 4
  },
  {
    type: "resistance",
    name: "Bench Press",
    duration: 20,
    weight: 285,
    reps: 10,
    sets: 4
  },
  {
    type: "resistance",
    name: "Bench Press",
    duration: 20,
    weight: 300,
    reps: 10,
    sets: 4
  },
  {
    type: "resistance",
    name: "Quad Press",
    duration: 30,
    weight: 300,
    reps: 10,
    sets: 4
  },
  {
    type: "resistance",
    name: "Military Press",
    duration: 20,
    weight: 300,
    reps: 10,
    sets: 4
  },
  {
    type: "resistance",
    name: "Bench Press",
    duration: 20,
    weight: 300,
    reps: 10,
    sets: 4
  },
  {
    type: "resistance",
    name: "Bench",
    duration: 30,
    distance: 2
  }
]

db.Exercise.deleteMany({})
  .then(() => db.Exercise.collection.insertMany(exerciseSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");

    let workoutSeed = [
      {
        day: new Date().setDate(new Date().getDate() - 10),
        exercises: mongoose.Types.ObjectId(data.ops[0]._id)
      },
      {
        day: new Date().setDate(new Date().getDate() - 9),
        exercises: mongoose.Types.ObjectId(data.ops[1]._id)
      },
      {
        day: new Date().setDate(new Date().getDate() - 8),
        exercises: mongoose.Types.ObjectId(data.ops[2]._id)
      },
      {
        day: new Date().setDate(new Date().getDate() - 7),
        exercises: mongoose.Types.ObjectId(data.ops[3]._id)
      },
      {
        day: new Date().setDate(new Date().getDate() - 6),
        exercises: mongoose.Types.ObjectId(data.ops[4]._id)
      },
      {
        day: new Date().setDate(new Date().getDate() - 5),
        exercises: mongoose.Types.ObjectId(data.ops[5]._id)
      },
      {
        day: new Date().setDate(new Date().getDate() - 4),
        exercises: mongoose.Types.ObjectId(data.ops[6]._id)
      },
      {
        day: new Date().setDate(new Date().getDate() - 3),
        exercises: mongoose.Types.ObjectId(data.ops[7]._id)
      },
      {
        day: new Date().setDate(new Date().getDate() - 2),
        exercises: mongoose.Types.ObjectId(data.ops[8]._id)
      },
      {
        day: new Date().setDate(new Date().getDate() - 1),
        exercises: mongoose.Types.ObjectId(data.ops[9]._id)
      }
    ];

    db.Workout.deleteMany({})
      .then(() => db.Workout.collection.insertMany(workoutSeed))
      .then(data => {
        console.log(data.result.n + " records inserted!");
        process.exit(0);
      })
      .catch(err => {
        console.error(err);
        process.exit(1);
      });

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
  });