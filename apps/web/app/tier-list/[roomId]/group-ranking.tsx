import db from "@/lib/instant";
import { Tier, TierItem } from "@/lib/types";
import { useParams } from "next/navigation";

export default function GroupRanking({
  tiers,
  items,
}: {
  tiers: Tier[];
  items: TierItem[];
}) {
  const { roomId } = useParams();

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Add type assertion to handle potential 'never' type and implicit 'any' */}
      {/* Consider refining the db.useQuery definition for better type safety */}
      {data!.rooms[0]!.rankings?.map((ranking: { id: string }) => (
        <div key={ranking.id}>{ranking.id}</div>
      ))}
    </div>
  );
}
