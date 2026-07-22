import cors from "cors";
import express from "express";
import { broadcastRouter } from "./routes/broadcastRoutes.js";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

app.use("/api", broadcastRouter);
