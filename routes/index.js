var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Course = require("../models/course");
var Job = require("../models/job");
var Ad = require("../models/ad");
var multer = require("multer");
var path = require("path");

var mongoose = require("mongoose");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    /*Appending extension with original name*/
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

router.get("/", function (req, res, next) {
  return res.render("index.ejs");
});

router.get("/dashboard", (req, res) => {
  return res.render("dashboard.ejs");
});

router.get("/job", (req, res) => {
  return res.render("job.ejs");
});
router.get("/ad", (req, res) => {
  return res.render("ad.ejs");
});

router.post("/", function (req, res, next) {
  // console.log(req.body);
  var personInfo = req.body;

  if (!personInfo.email || !personInfo.password || !personInfo.passwordConf) {
    res.send();
  } else {
    if (personInfo.password == personInfo.passwordConf) {
      User.findOne({ email: personInfo.email }, function (err, data) {
        if (!data) {
          var c;
          User.findOne({}, function (err, data) {
            if (data) {
              console.log("if");
              c = data.unique_id + 1;
            } else {
              c = 1;
            }

            var newPerson = new User({
              unique_id: c,
              email: personInfo.email,
              status: personInfo.status,
              password: personInfo.password,
              passwordConf: personInfo.passwordConf,
            });

            newPerson.save(function (err, Person) {
              if (err) console.log(err);
              else console.log("Success");
            });
          })
            .sort({ _id: -1 })
            .limit(1);
          res.send({ Success: "You are regestered,You can login now." });
        } else {
          res.send({ Success: "Email is already used." });
        }
      });
    } else {
      res.send({ Success: "password is not matched" });
    }
  }
});

router.get("/login", function (req, res, next) {
  return res.render("login.ejs");
});

router.post("/login", function (req, res, next) {
  //console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, data) {
    if (data) {
      if (data.password == req.body.password) {
        //console.log("Done Login");
        req.session.userId = data.unique_id;
        //console.log(req.session.userId);
        if (data.status === "Teacher") {
          return res.redirect("/dashboard");
        } else {
          return res.redirect("/profile");
        }
        // res.send({ Success: "Success!" });
      } else {
        res.send({ Success: "Wrong password!" });
      }
    } else {
      res.send({ Success: "This Email Is not regestered!" });
    }
  });
});

router.get("/profile", function (req, res, next) {
  User.findOne({ unique_id: req.session.userId }, async function (err, data) {
    if (!data) {
      res.redirect("/");
    } else {
      const courses = await Course.find();
      const ad = await Ad.find();
      // console.log(courses);
      return res.render("data.ejs", {
        email: data.email,
        courses: courses,
        ad: ad,
      });
    }
  });
});
router.get("/show-job", function (req, res, next) {
  User.findOne({ unique_id: req.session.userId }, async function (err, data) {
    if (!data) {
      res.redirect("/");
    } else {
      const job = await Job.find();
      const ad = await Ad.find();
      // console.log(courses);
      return res.render("show-job.ejs", {
        email: data.email,
        jobs: job,
        ad: ad,
      });
    }
  });
});

router.get("/logout", function (req, res, next) {
  console.log("logout");
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect("/");
      }
    });
  }
});

router.get("/forgetpass", function (req, res, next) {
  res.render("forget.ejs");
});

router.post("/forgetpass", function (req, res, next) {
  //console.log('req.body');
  //console.log(req.body);
  User.findOne({ email: req.body.email }, function (err, data) {
    // console.log(data);
    if (!data) {
      res.send({ Success: "This Email Is not regestered!" });
    } else {
      // res.send({"Success":"Success!"});
      if (req.body.password == req.body.passwordConf) {
        data.password = req.body.password;
        data.passwordConf = req.body.passwordConf;

        data.save(function (err, Person) {
          if (err) console.log(err);
          else console.log("Success");
          res.send({ Success: "Password changed!" });
        });
      } else {
        res.send({
          Success: "Password does not matched! Both Password should be same.",
        });
      }
    }
  });
});

router.post("/dashboard", upload.single("image"), async (req, res) => {
  const {
    title,
    insinuate,
    email,
    attend,
    level,
    information,
    skills,
    phone,
    date,
    time,
    description,
    subscription,
    keywords,
  } = req.body;

  const course = new Course({
    title,
    insinuate,
    email,
    attend,
    level,
    keywords,
    information,
    skills,
    phone,
    date,
    time,
    description,
    subscription,
    image: req.file.filename,
  });

  try {
    await course.save();
    return res.redirect("/dashboard");
  } catch (e) {
    console.log(e.message);
    return res.redirect("/dashboard");
  }
});

router.get("/:_id", async (req, res) => {
  try {
    console.log(req.params._id);
    const course = await Course.findById({
      _id: req.params._id,
    });
    // console.log(course);
    return res.render("course.ejs", { course });
  } catch (error) {
    // console.log(error.message);
  }
});

router.post("/job", async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    return res.redirect("/job");
  } catch (error) {
    console.log(error.message);
    return;
  }
});
router.post("/ad", upload.single("image"), async (req, res) => {
  try {
    const ad = new Ad({
      title: req.body.title,
      description: req.body.description,
      sale: req.body.sale,
      discount: req.body.discount,
      image: req.file.filename,
    });
    await ad.save();
    return res.redirect("/ad");
  } catch (error) {
    console.log(error.message);
    return;
  }
});

router.get("/job/:jobId", async function (req, res, next) {
  try {
    const job = await Job.findById({ _id: req.params.jobId });
    return res.render("job-detailed", { id: req.params.id, job: job });
  } catch (error) {
    console.log(e.message);
    return res.redirect("/show-job");
  }
});

router.get("/ad/:adId", async function (req, res, next) {
  try {
    const job = await Ad.findById({ _id: req.params.adId });
    console.log(job);
    return res.render("ad-detailed", { id: req.params.id, job: job });
  } catch (error) {
    console.log(error.message);
    return res.redirect("/show-job");
  }
});

module.exports = router;
