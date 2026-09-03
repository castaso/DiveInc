"use strict";

const route = require("express").Router({ mergeParams: true }); // Create router

const user = require("./user"); // User model initialization
const article = require("./article"); // User model initialization
const articleCategory = require("./articleCategory"); // User model initialization
const country = require("./country"); // Country model initialization
const city = require("./city"); // Country model initialization
const language = require("./language"); // Country model initialization
const ideal = require("./ideal"); // Country model initialization
const room = require("./room"); // Country model initialization
const vPackage = require("./package"); // Country model initialization
const roomOption = require("./roomOption"); // Country model initialization
const roomAminity = require("./roomAminity"); // Country model initialization
const activity = require("./activity"); // Country model initialization
const facility = require("./facility"); // Country model initialization
const sport = require("./sport"); // Country model initialization
const general = require("./general"); // Country model initialization
const destination = require("./destination"); // Destination model initialization
const subDestination = require("./subDestination"); // Sub Destination model initialization
const creature = require("./creature"); // Creature model initialization
const transactionWallet = require("./transactionWallet"); // Creature model initialization
const transactionCreator = require("./transactionCreator"); // Creature model initialization
const transactionResort = require("./transactionResort");
const transactionLiveaboard = require("./transactionLiveaboard"); // Creature model initialization // Creature model initialization
const transactionDivecenter = require("./transactionDivecenter"); // Creature model initialization
const resort = require("./resort"); // Country model initialization
const divecenter = require("./divecenter"); // Country model initialization
const liveaboard = require("./liveaboard"); // Country model initialization
const testimoni = require("./testimoni"); // Country model initialization
const schedule = require("./schedule"); // Country model initialization
const contribution = require("./contribution");
//const subDestination = require("./subDestination"); // Destination model initialization
const transactionWalletAdmin = require("./transactionWalletAdmin");
const transactionContribution = require("./transactionContribution"); 

route.use("/user", user); // User model routing
route.use("/article", article); // User model routing
route.use("/article-category", articleCategory); // User model routing
route.use("/country", country); // User model routing
route.use("/city", city); // User model routing
route.use("/ideal", ideal); // User model routing
route.use("/room", room); // User model routing
route.use("/package", vPackage); // User model routing
route.use("/room-option", roomOption); // User model routing
route.use("/room-aminity", roomAminity); // User model routing
route.use("/activity", activity); // User model routing
route.use("/facility", facility); // User model routing
route.use("/sport", sport); // User model routing
route.use("/language", language); // User model routing
route.use("/destination", destination); // User model routing
route.use("/sub-destination", subDestination); // User model routing
route.use("/creature", creature); // User model routing
route.use("/transaction-wallet", transactionWallet); // User model routing
route.use("/transaction-creator", transactionCreator); // User model routing
route.use("/transaction-resort", transactionResort);
route.use("/transaction-liveaboard", transactionLiveaboard);
route.use("/resort", resort); // User model routing
route.use("/transaction-divecenter", transactionDivecenter);
route.use("/divecenter", divecenter); // User model routing
route.use("/liveaboard", liveaboard); // User model routing
route.use("/testimony", testimoni);
route.use("/schedule", schedule);
route.use("/general", general);
route.use("/contribution", contribution);
//route.use("/sub-destination", subDestination); // User model routing
route.use("/transaction-wallet-admin", transactionWalletAdmin);
route.use("/transaction-contribution", transactionContribution);

module.exports = route;
