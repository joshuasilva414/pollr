import type * as Party from "partykit/server";
import type { TierRoom } from "shared/types";
import Route from "route-parser";
import { Hono } from "hono";
import { partyserverMiddleware } from "hono-party";

export default class Server implements Party.Server {
  tierRoom: TierRoom;
  constructor(readonly room: Party.Room) {
    this.tierRoom = {
      tiers: [],
      items: [],
      userRankings: new Map(),
    };
  }

  async onStart(): Promise<void> {
    const tierRoom = await this.room.storage.get<TierRoom>(this.room.name);
    if (!tierRoom) {
      await this.room.storage.put(this.room.name, this.tierRoom);
    }
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
      id: ${conn.id}
      room: ${this.room.id}
      url: ${new URL(ctx.request.url).pathname}`
    );

    // let's send a message to the connection
    conn.send("hello from server");
  }

  onMessage(message: string, sender: Party.Connection) {
    // let's log the message
    console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(
      `${sender.id}: ${message}`,
      // ...except for the connection it came from
      [sender.id]
    );
  }
}

Server satisfies Party.Worker;

export const app = new Hono().basePath("/parties/:party/:roomId");

app.use("*", partyserverMiddleware());

app.get("/room/create/:roomName", async (c) => {
  // const roomData = await c.req.json<TierRoom>();
  console.log(c.req.param().roomName);
  // c.json(roomData);
});
