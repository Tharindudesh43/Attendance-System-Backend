import express from "express";
import mongoose from "mongoose";
import adminfirebase from "firebase-admin";
import cors from "cors";
import AdminRoute from "./routes/admin_routes.js";
import LecturerRoute from "./routes/lecturer_routes.js";
import AdminReportRoute from "./routes/admin_report_routes.js";
import dotenv from "dotenv";
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();

//MongoDB Connection URL
const MongoURL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 8080;

adminfirebase.initializeApp({
  credential: adminfirebase.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const messaging = adminfirebase.messaging();
const dbfirebase = adminfirebase.firestore();

//middleware for handling CORS POLICY
app.use(cors());

//Middleware for parsing request body
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server Started on ${PORT}`);
});

app.use("/admin_report", AdminReportRoute);
app.use("/admin", AdminRoute);
app.use("/lecturer", LecturerRoute);

//MongoDB Connection
mongoose
  .connect(MongoURL, { dbName: "AttendanceSystem" })
  .then(() => {
    console.log("Connected to Attendace System Database");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});