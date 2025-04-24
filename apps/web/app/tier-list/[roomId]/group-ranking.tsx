import db from "@/lib/instant";
import { useEffect, useState } from "react";
import { Tier, TierItem } from "@/lib/types";
import ItemCard from "@/components/item-card";

export default function GroupRanking({
  tiers,
  items,
  roomId,
  userName,
  peers,
}: {
  tiers: Tier[];
  items: TierItem[];
  roomId: string;
  userName: string;
  peers: any;
}) {
  // Connect to the room for presence
  const room = db.room("tierList", roomId);

  // Publish presence with the user name
  //   useEffect(() => {
  //     publishPresence({
  //       name: userName,
  //       status: "active",
  //     });
  //   }, [userName, publishPresence]);

  // Get room data
  const { isLoading, error, data } = db.useQuery({
    lists: {
      $rankings: {},
      $users: {},
      $: {
        where: {
          id: roomId,
        },
      },
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Collect all peers
  const allPeers = Object.entries(peers).map(([peerId, peerData]) => ({
    name: (peerData as any)?.name || "Anonymous",
    peerId,
  }));

  // Add current user to the list
  const allUsers = [
    { name: `${userName} (You)`, peerId: "current-user" },
    ...allPeers,
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        Connected Users ({allUsers.length}):
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {allUsers.map((user) => (
          <div
            key={user.peerId}
            className={`p-3 rounded-md shadow ${
              user.peerId === "current-user"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            {user.name}
          </div>
        ))}
      </div>

      {/* Display group rankings here when implemented */}
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Group Rankings</h3>
        <p className="text-sm text-muted-foreground">
          Group rankings will be shown here based on everyone's selections.
        </p>
      </div>
    </div>
  );
}
