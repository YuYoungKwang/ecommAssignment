import cors from "cors";
import express from "express";
import { broadcastRouter } from "./routes/broadcastRoutes.js";

export const app = express();

// 포트:5173 요청만 허용
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

app.use(express.json());

// 서버 상태 확인
app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

// /api 로 시작되는 요청시 broadcastRouter 호출
app.use("/api", broadcastRouter);
