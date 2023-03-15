const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
  },
  age: {
    type: Number,
    default: 18,
    max: [80, "可能有點太老囉!!"],
    min: [0, "年齡不能小於0.."],
  },
  major: {
    type: String,
    require: true,
  },
  scholarship: {
    merit: {
      type: Number,
      min: 0,
      max: [5000, "學生merit scholarship太多了"],
      default: 0,
    },
    other: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
