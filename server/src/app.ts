import cors from "cors";
import express from "express";

// app.ts는 Express 앱의 전체 설정을 담당합니다.
// Java로 비유하면 Spring Boot에서 공통 설정과 라우터 등록을 해두는 부분에 가깝습니다.
export const app = express();


// 프론트엔드 localhost:5173 요청만 허용, 
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// 프론트엔드가 JSON body를 보내면 request.body로 읽을 수 있게 변환.
app.use(express.json());

// 서버 상태 확인
app.get("/health", (_request, response) => {
  response.json({ ok: true });
});
