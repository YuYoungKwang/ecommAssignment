import cors from "cors";
import express from "express";

const app = express();
const port = 3000;

// 미들웨어
// http://localhost:5173 요청만 허용
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());


// 서버 상태 체크
app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

// 3000번 포트 요청 대기
app.listen(port, () => {
  console.log(`API server: http://localhost:${port}`);
});