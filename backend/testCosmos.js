import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Order from "./src/models/Order.js";

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const orders = await Order.find({}).sort({ createdAt: -1 });
    console.log("Found orders:", orders.length);

  } catch (err) {
    fs.writeFileSync("err.log", err.message);
  } finally {
    process.exit(0);
  }
}

run();
