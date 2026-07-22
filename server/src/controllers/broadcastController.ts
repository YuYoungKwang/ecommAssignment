import type { Request, Response } from "express";
import { getBroadcastRows } from "../services/broadcastService.js";
import type { ItemType } from "../types/broadcast.js";


function isItemType(value: unknown): value is ItemType {
  return value === "lb" || value === "hs";
}

export async function getBroadcastItems(request: Request, response: Response) {
  const type = request.body.type;

  if (!isItemType(type)) {
    response.status(400).json({
      message: "payload.type은 lb 또는 hs여야 합니다.",
    });
    return;
  }

  try {
    const items = await getBroadcastRows(type);

    response.json({ type, items });
  } catch (error) {
    console.error(error);
    response.status(502).json({
      message: "외부 데이터를 불러오지 못했습니다.",
    });
  }
}
