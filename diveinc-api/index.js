"use strict";

require("dotenv").config(); // Loads environment variables from a .env file into process.env -> https://www.npmjs.com/package/dotenv
require(`module-alias/register`); // Module aliases initialization

/* Library initialization */
const express = require("express"); // Web framework -> https://www.npmjs.com/package/express
const fs = require("fs"); // file stream
const path = require("path"); // location file or folder
const bodyParser = require("body-parser"); // Body parsing middleware -> https://www.npmjs.com/package/body-parser
const morgan = require("morgan"); // HTTP request logger middleware -> https://www.npmjs.com/package/morgan
const helmet = require("helmet"); // Secure by setting various HTTP headers -> https://www.npmjs.com/package/helmet
const rfs = require("rotating-file-stream"); // Creates a stream.Writable to a file which is rotated -> https://www.npmjs.com/package/rotating-file-stream

// const sequelize = require("@helpers/conection");
// const winston = require("@helpers/winston");
const controller = require("@controller");
// const response = require("@helpers/response");
// const cron = require("@helpers/cron")
const cronJob = require("@helpers/cron")

/* Initial express into app */
const app = express();

/* Use body parser */
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

/* Use morgan */
if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "development") {
  // Checking environment to use type of morgan

  let logDirectory = path.join(__dirname, "log_access"); // Log directory initialization
  fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory); // ensure log directory exists

  // create a rotating write stream
  let accessLogStream = rfs.createStream("access.log", {
    size: process.env.RFS_SIZE || "5M", // default rotate after file size is 5MB
    interval: process.env.RFS_TIME || "7d", // default rotate every week
    path: logDirectory
  });

  app.use(morgan("combined", { stream: accessLogStream })); // setup the logger
} else {
  app.use(morgan("dev")); // Concise output colored by response status for development use
}

/* Use helmet */
app.use(helmet()); // Default setting -> DNS prefetching, clickjacking, hide Power By, HSTS, X-Download-Options IE8+, sniffing MIME Type, XSS Protection

/* Testing the connection to db */
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.");
//   })
//   .catch(err => {
//     console.error("Unable to connect to the database:", err);
//   });

// Run cron job
//cron.start()

app.use(express.static(path.join(__dirname, "public")));

/* Route initialization */
app.use("/v1", controller);
app.use("*", (req, res) => {
  //response.notfound(res, "Endpoint Not Found");
  res.status(404).send({
      success : false,
      message : "Endpoint Not Found"
  })
});

/* Server initialization */
const environment = process.env.NODE_ENV || "test";
const host = process.env.HOST || "localhost"; // hostname
const port = process.env.PORT || 3333; // used port

// app.listen(port, host, () => {
//   console.log(`Service start on env : ${environment}, host : ${host} and port : ${port}`);
// });

//cronJob.runCronDoneResort()

app.listen(port)
console.log(`Service start`);
