const mongoose = require("mongoose");
require("dotenv").config();

const dbUrl = process.env.mongodbURL;

const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log("database running.....");
  } catch (err) {
    console.log(err.message, "cann't connect to database");
    process.exit(1);
  }
};

mongoose.set("useFindAndModify", false);

module.exports = connectDb;
