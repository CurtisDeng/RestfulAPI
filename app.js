const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Student = require("./models/student");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);

mongoose
  .connect("mongodb://localhost:27017/exampleDB")
  .then(() => {
    console.log("成功連接mongoDB!!");
  })
  .catch((e) => {
    console.log("連接失敗");
  });

app.get("/students", async (req, res) => {
  try {
    const studentData = await Student.find().exec();
    return res.send(studentData);
  } catch (e) {
    return res.status(500).send(e);
  }
});

app.get("/students/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const studentData = await Student.findOne({ _id }).exec();
    return res.send({ meg: "成功取得學生資料", student: studentData });
  } catch (e) {
    return res.status(400).send("尋找資料時發生錯誤");
  }
});

app.post("/students", async (req, res) => {
  try {
    const { name, age, major, merit, other } = req.body;
    const newstudent = new Student({
      name,
      age,
      major,
      sholarship: {
        merit,
        other,
      },
    });
    const savedstudent = await newstudent.save();
    return res.send({ meg: "成功儲存學生資料", saveObject: savedstudent });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

app.put("/students/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, age, major, merit, other } = req.body;
    const newData = await Student.findOneAndUpdate(
      { _id },
      { name, age, major, sholarship: { merit, other } },
      { new: true, runValidators: true, overwrite: true }
    );
    res.send({ meg: "成功更新學生資料", updatedData: newData });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

class NewData {
  constructor() {}

  setProperty(key, value) {
    if (key !== "merit" && key !== "other") {
      this[key] = value;
    } else {
      this[`scholarship.${key}`] = value;
    }
  }
}

app.patch("/students/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const { name, age, major, merit, other } = req.body;
    const newObject = new NewData();
    for (let property in req.body) {
      newObject.setProperty(property, req.body[property]);
    }
    const updatedStudent = await Student.findOneAndUpdate({ _id }, newObject, {
      new: true,
      runValidators: true,
    });
    return res.send({
      meg: "成功儲存更改學生資料",
      updateData: updatedStudent,
    });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

app.delete("/students/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    let deleteStudent = await Student.deleteOne({ _id }).exec();
    return res.send({ meg: "成功修改學生資料", deleteData: deleteStudent });
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

app.listen(3000, () => {
  console.log("伺服器正在聆聽port 3000");
});
