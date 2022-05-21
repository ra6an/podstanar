const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");

let DB, password;

if (process.env.NODE_ENV === "development") {
  password = process.env.PASSWORD_DB;
  DB = process.env.MONGO_DB.replace("<PASSWORD>", password);
} else {
  password = process.env.PASSWORD_DB_PROD;
  DB = process.env.MONGO_DB_PROD.replace("<PASSWORD>", password);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Starting server on port: ${PORT}, ENV: ${process.env.NODE_ENV}`);
});

const server = mongoose
  .connect(DB)
  .then(() => {
    console.log(`MONGODB connection established!!!`);
  })
  .catch((err) => {
    console.log("Something went wrong with DB!");
    console.log(err);
  });
