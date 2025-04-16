import { init, id } from "@instantdb/react";
import { createRoomSchema } from "./zod";
import { z } from "zod";

// ID for app: pollr
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;
const db = init({ appId: APP_ID });
export default db;

export const createRoom = async (room: z.infer<typeof createRoomSchema>) => {
  const roomId = id();
  await db.transact(db.tx.rooms![roomId]!.update({ ...room }));

  return roomId;
};
