/*
This file connects the app to the MongoDB database.
*/

const mongoose = require("mongoose");

//MongoDB connection URL
const URL = process.env.DATABASEURL

const connectDB = async () => {
    await mongoose.connect(URL);
    console.log("database successfully connected");
}

//The connectDB function is exported
module.exports = connectDB;