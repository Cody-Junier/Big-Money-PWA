const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const dotenv = require('dotenv')
require('dotenv').config()
console.log(process.env.test)
console.log(process.env.MONGODB_URI2)
const PORT = process.env.PORT || 3001;
const MONGODB_URI ='mongodb+srv://codyjunier:Mastershake3!@cluster0.4bjws.mongodb.net/Big-Money?'
// .env.MONGODB_URI || "mongodb://localhost/budget";
const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});