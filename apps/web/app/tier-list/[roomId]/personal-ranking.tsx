"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";
import type { Tier, TierItem } from "@/lib/types";
import db from "@/lib/instant";
import ItemCard from "@/components/item-card";
import { Button } from "@/components/ui/button";

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

  // Sync user rankings to database whenever tierItems state changes
  useEffect(() => {
    // Only sync if we have a valid userName and roomId
    if (userName && roomId && tierItems) {
      // Debounce the sync to avoid too many database calls
      const timeoutId = setTimeout(async () => {
        try {
          // Generate a unique ID for this ranking based on userName
          const rankingId = `${roomId}_${userName.replace(/\s+/g, "_")}`;

          // Save the current ranking to the database
          await db.transact([
            db.tx.rankings![rankingId]!.update({
              ranked: tierItems,
              unranked: [],
            }),
            db.tx.lists![roomId]!.update({
              rankings: {
                [userName]: rankingId,
              },
            }),
          ]);

          console.log(`Rankings synced for user: ${userName}`);
        } catch (error) {
          console.error("Error syncing rankings:", error);
        }
      }, 500); // Debounce for 500ms

      // Clean up timeout
      return () => clearTimeout(timeoutId);
    }
  }, [tierItems, userName, roomId]);

  // State to track the currently selected item
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Function to handle item selection
  const handleItemSelect = (itemName: string) => {
    setSelectedItem(itemName === selectedItem ? null : itemName);
  };

  // Function to handle tier selection (to move selected item into)
  const moveItemToTier = (tierName: string) => {
    if (!selectedItem) return;

    // Find which tier currently has this item
    let sourceTier: string = "unassigned";
    for (const [tier, tierItemList] of Object.entries(tierItems) as [
      string,
      string[],
    ][]) {
      if (tierItemList.includes(selectedItem)) {
        sourceTier = tier;
        break;
      }
    }

    // Don't do anything if item is already in this tier
    if (sourceTier === tierName) {
      setSelectedItem(null);
      return;
    }

    // Update the state by removing the item from its current tier
    // and adding it to the target tier
    setTierItems((prev) => {
      const newState = { ...prev };
      newState[sourceTier] =
        newState[sourceTier]?.filter((name) => name !== selectedItem) || [];
      newState[tierName] = [...(newState[tierName] || []), selectedItem];
      return newState;
    });

    // Clear selection after moving
    setSelectedItem(null);
  };

  // Find item by name
  const getItemByName = (name: string) => {
    return items.find((item) => item.name === name);
  };

  // Function to handle item drop (kept for desktop compatibility)
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

      {selectedItem && (
        <div className="mb-4 p-3 bg-secondary rounded-md">
          <p className="text-sm font-medium mb-2">
            Tap a tier to place "{selectedItem}" or
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => setSelectedItem(null)}
            >
              Cancel
            </Button>
          </p>
        </div>
      )}

      <div className="flex flex-col">
        {tiers?.map((tier) => (
          <div
            key={tier.name}
            className={`grid grid-cols-8 border border-foreground ${
              selectedItem ? "cursor-pointer" : ""
            }`}
            onClick={() => selectedItem && moveItemToTier(tier.name as string)}
            onDrop={(e) => handleDrop(e, tier.name as string)}
            onDragOver={(e) => {
              e.preventDefault();
            }}
          >
            <div
              className={`aspect-square span-1 border-foreground border-r flex items-center justify-center`}
              style={{ backgroundColor: tier.color }}
            >
              <p>{tier.name}</p>
            </div>
            <div className="col-span-7 min-h-16 flex flex-wrap gap-2 p-2">
              {tierItems[tier.name as string]?.map((itemName) => {
                const item = getItemByName(itemName);
                if (!item) return null;

                return (
                  <div key={itemName} className="w-12 h-12">
                    <ItemCard
                      item={item}
                      isSelected={selectedItem === itemName}
                      onClick={() => handleItemSelect(itemName)}
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
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {tierItems.unassigned?.map((itemName) => {
            const item = getItemByName(itemName);
            if (!item) return null;

            return (
              <div key={item.name} className="span-1 aspect-square">
                <ItemCard
                  item={item}
                  isSelected={selectedItem === itemName}
                  onClick={() => handleItemSelect(itemName)}
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
