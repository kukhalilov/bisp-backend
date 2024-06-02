import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import routes from "./api/routes/index.js";

const createServer = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  connectDB();

  app.get("/", (req, res) => {
    res.send("Welcome to MedEase!");
  });

  app.use("/api", routes);

  return app;
};

export default createServer;
