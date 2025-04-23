"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import db from "@/lib/instant";
import PersonalRanking from "./personal-ranking";
import GroupRanking from "./group-ranking";
import { useEffect } from "react";

export default function Client({ roomId }: { roomId: string }) {
  const { isLoading, error, data } = db.useQuery({
    lists: {
      $rankings: {},
      $users: {},
      $: {
        where: {
          id: roomId as string,
        },
      },
    },
  });
  const tiers = data?.lists?.[0]?.tiers;
  const items = data?.lists?.[0]?.items;

  const room = db.room("tierList", roomId);
  const { user, peers, publishPresence } = db.rooms.usePresence(room);
  // Publish your presence to the room
  useEffect(() => {
    publishPresence({ name: user?.name, status: "joined" });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full pt-10">
      <div className="w-full md:w-3/4 mx-4 md:mx-auto">
        <h1 className="text-center w-full leading-16 text-2xl font-bold">
          Tier List
        </h1>
        <Tabs defaultValue="my-ranking">
          <TabsList className="w-full justify-center">
            <TabsTrigger value="my-ranking">My Ranking</TabsTrigger>
            <TabsTrigger value="group-ranking">Group Ranking</TabsTrigger>
          </TabsList>
          <TabsContent value="my-ranking">
            <PersonalRanking tiers={tiers} items={items} roomId={roomId} />
          </TabsContent>
          <TabsContent value="group-ranking">
            <GroupRanking
              tiers={tiers}
              items={items}
              roomId={roomId}
              peers={Object.values(peers).map((peer) => ({
                name: peer.name,
                peerId: peer.peerId,
              }))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
