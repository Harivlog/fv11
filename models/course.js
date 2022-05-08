var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    insinuate: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    attend: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    keywords: {
      type: String,
      required: true,
    },
    information: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    subscription: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 50,
    },
    image: String,
  },

  { timestamps: true }
)),
  (Course = mongoose.model("Course", courseSchema));

module.exports = Course;
