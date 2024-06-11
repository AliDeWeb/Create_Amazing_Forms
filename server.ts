import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config({ path: "./configs.env" });

const port = process.env.PORT as string;
app.listen(port, () => {
  console.log(`App started on port ${port} successfully 👍`);
});

const db = process.env.DATABASE as string;
(async () => {
  await mongoose.connect(db);
  console.log(`Db connected successfully 👍`);
})();
