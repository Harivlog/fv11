var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    eduction: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    payment: {
      type: String,
      required: true,
    },
    apply: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    vacancies: {
      type: Number,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    linkedIn: {
      type: String,
      required: true,
    },
    fb: {
      type: String,
      required: true,
    },
    instagram: {
      type: String,
      required: true,
    },
    twitter: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)),
  (Job = mongoose.model("Job", jobSchema));

module.exports = Job;
