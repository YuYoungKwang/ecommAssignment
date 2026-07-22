import { Router } from "express";
import { getBroadcastItems } from "../controllers/broadcastController.js";

export const broadcastRouter = Router();

broadcastRouter.post("/items", getBroadcastItems);
