import { Router } from "express";
import { getBroadcastItems } from "../controllers/broadcastController.js";

// 라우터 생성
export const broadcastRouter = Router();

// post /items 요청시 getBroadcastItems 호출
broadcastRouter.post("/items", getBroadcastItems);
