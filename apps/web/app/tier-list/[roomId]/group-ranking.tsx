import db from "@/lib/instant";
import { useEffect } from "react";
import { Tier, TierItem } from "@/lib/types";
import { useParams } from "next/navigation";

export default function GroupRanking({
  tiers,
  items,
  roomId,
  peers,
}: {
  tiers: Tier[];
  items: TierItem[];
  roomId: string;
  peers: { name: string; peerId: string }[];
}) {
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {peers.map((peer) => (
        <div key={peer.peerId}>{peer.name}</div>
      ))}
      {/* {data!.lists[0]!.rankings?.map((ranking: { id: string }) => (
        <div key={ranking.id}>{ranking.id}</div>
      ))} */}
    </div>
  );
}
