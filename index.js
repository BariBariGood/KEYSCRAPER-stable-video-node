const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const {VideoProcessor} = require("./VideoProcessor.js");
const path = require("path");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("/static", express.static("public"));
app.use("/frames", express.static("frames"));

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/process-video", function(req, res) {
  let {name} = req;
  name = filenameSanitizer(name); // EXAMPLE CODE TO SANITIZE NAME!
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});