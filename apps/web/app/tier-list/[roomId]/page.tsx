"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createRoomSchema } from "@/lib/zod";
import Image from "next/image";
import { useParams } from "next/navigation";
import { z } from "zod";
import { useState } from "react";
import db from "@/lib/instant";
import PersonalRanking from "./personal-ranking";
import GroupRanking from "./group-ranking";
export default function Page() {
  const { roomId } = useParams();

  if (!roomId) {
    return <div>No room ID</div>;
  }

  const { isLoading, error, data } = db.useQuery({
    rooms: {
      $rankings: {},
      $users: {},
      $: {
        where: {
          id: roomId as string,
        },
      },
    },
  });
  const tiers = data?.rooms?.[0]?.tiers;
  const items = data?.rooms?.[0]?.items;

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
            <PersonalRanking tiers={tiers} items={items} />
          </TabsContent>
          <TabsContent value="group-ranking">
            <GroupRanking tiers={tiers} items={items} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
