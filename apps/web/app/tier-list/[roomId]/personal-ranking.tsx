"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import type { Tier, TierItem } from "@/lib/types";
import db from "@/lib/instant";
import ItemCard from "@/components/item-card";

export default function PersonalRanking({
  tiers,
  items,
  roomId,
  userName,
  setUserName,
}: {
  tiers: Tier[];
  items: TierItem[];
  roomId: string;
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
}) {
  const room = db.room("tierList", roomId);
  const { peers, publishPresence } = db.rooms.usePresence(room);

  // Publish your presence to the room with the username
  useEffect(() => {
    publishPresence({
      name: userName,
      status: "joined",
    });
  }, [userName, publishPresence]);

  // State to track items in each tier
  const [tierItems, setTierItems] = useState<Record<string, string[]>>({
    ...tiers?.reduce(
      (acc, tier) => {
        acc[tier.name as string] = [];
        return acc;
      },
      {} as Record<string, string[]>
    ),
    unassigned: items?.map((item) => item.name) || [],
  });

  // Function to handle item drop into a tier
  const handleDrop = (e: React.DragEvent, tierName: string) => {
    e.preventDefault();
    const itemName = e.dataTransfer.getData("text/plain");

    // Find which tier currently has this item
    let sourceTier: string = "unassigned";
    for (const [tier, tierItemList] of Object.entries(tierItems) as [
      string,
      string[],
    ][]) {
      if (tierItemList.includes(itemName)) {
        sourceTier = tier;
        break;
      }
    }

    // Don't do anything if item is already in this tier
    if (sourceTier === tierName) return;

    // Update the state by removing the item from its current tier
    // and adding it to the target tier
    setTierItems((prev) => {
      const newState = { ...prev };
      newState[sourceTier] =
        newState[sourceTier]?.filter((name) => name !== itemName) || [];
      newState[tierName] = [...(newState[tierName] || []), itemName];
      return newState;
    });
  };

  // Find item by name
  const getItemByName = (name: string) => {
    return items.find((item) => item.name === name);
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Your Name:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex flex-col">
        {tiers?.map((tier) => (
          <div
            key={tier.name}
            className="grid grid-cols-8 border border-foreground"
          >
            <div
              className={`aspect-square span-1 border-foreground border-r flex items-center justify-center`}
              style={{ backgroundColor: tier.color }}
            >
              <p>{tier.name}</p>
            </div>
            <div
              className="col-span-7 min-h-16 flex flex-wrap gap-2 p-2"
              onDrop={(e) => handleDrop(e, tier.name as string)}
              onDragOver={(e) => {
                e.preventDefault();
              }}
            >
              {tierItems[tier.name as string]?.map((itemName) => {
                const item = getItemByName(itemName);
                if (!item) return null;

                return (
                  <div key={itemName} className="w-12 h-12">
                    <ItemCard
                      item={item}
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", itemName);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="py-6">Items</h2>
        <div className="grid grid-cols-8 gap-4">
          {tierItems.unassigned?.map((itemName) => {
            const item = getItemByName(itemName);
            if (!item) return null;

            return (
              <div key={item.name} className="span-1 aspect-square">
                <ItemCard
                  item={item}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", item.name);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
