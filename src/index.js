import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.configDotenv({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, (req, res) => {
      console.log("App is running on port: ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Mongodb connection failed!!! ", err);
  });
