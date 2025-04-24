"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import db from "@/lib/instant";
import PersonalRanking from "./personal-ranking";
import GroupRanking from "./group-ranking";
import { useEffect, useState } from "react";

export default function Client({ roomId }: { roomId: string }) {
  // Set a random user name for this client if not set
  const [userName, setUserName] = useState(
    `User-${Math.floor(Math.random() * 1000)}`
  );

  const { isLoading, error, data } = db.useQuery({
    lists: {
      rankings: {},
      $: {
        where: {
          id: roomId as string,
        },
      },
    },
  });
  const tiers = data?.lists?.[0]?.tiers;
  const items = data?.lists?.[0]?.items;
  console.log(tiers, items);

  const room = db.room("tierList", roomId);
  const { peers, publishPresence } = db.rooms.usePresence(room);

  // Publish presence with the user name
  useEffect(() => {
    publishPresence({
      name: userName,
      status: "joined",
    });
  }, [userName, publishPresence]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full pt-4 md:pt-10 px-2 md:px-0">
      <div className="w-full md:w-3/4 mx-auto">
        <h1 className="text-center w-full leading-16 text-xl md:text-2xl font-bold mb-4">
          Tier List
        </h1>
        <div className="mb-3 p-3 bg-muted rounded-md text-sm">
          <p className="font-medium">Mobile Instructions:</p>
          <p>1. Tap an item to select it</p>
          <p>2. Tap a tier to place the selected item</p>
        </div>
        <Tabs defaultValue="my-ranking">
          <TabsList className="w-full justify-center">
            <TabsTrigger value="my-ranking">My Ranking</TabsTrigger>
            <TabsTrigger value="group-ranking">Group Ranking</TabsTrigger>
          </TabsList>
          <TabsContent value="my-ranking">
            <PersonalRanking
              tiers={tiers}
              items={items}
              roomId={roomId}
              userName={userName}
              setUserName={setUserName}
            />
          </TabsContent>
          <TabsContent value="group-ranking">
            <GroupRanking
              tiers={tiers}
              items={items}
              roomId={roomId}
              peers={peers}
              userName={userName}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
