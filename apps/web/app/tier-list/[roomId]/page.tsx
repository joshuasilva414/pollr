"use client";

import { createRoomSchema } from "@/lib/zod";
import Image from "next/image";
// import { useParams } from "next/navigation";
import { z } from "zod";
import { useState } from "react";
import db from "@/lib/instant";
// Define tier names type
type TierName = "S" | "A" | "B" | "C" | "D" | "unassigned";

export default function Page() {
  const { roomId } = useParams();
  // const tiers: z.infer<typeof createRoomSchema>["tiers"] = [
  //   { name: "S", color: "#ff7f7f" },
  //   { name: "A", color: "#ffbf7f" },
  //   { name: "B", color: "#ffdf7f" },
  //   { name: "C", color: "#ffff7f" },
  //   { name: "D", color: "#bfff7f" },
  // ];
  // const items: z.infer<typeof createRoomSchema>["items"] = [
  //   {
  //     name: "Item 1",
  //     image: "https://loremflickr.com/640/480",
  //   },
  //   { name: "Item 2", image: "https://loremflickr.com/640/480" },
  //   { name: "Item 3", image: "https://loremflickr.com/640/480" },
  //   { name: "Item 4", image: "https://loremflickr.com/640/480" },
  //   { name: "Item 5", image: "https://loremflickr.com/640/480" },
  //   { name: "Item 6", image: "https://loremflickr.com/640/480" },
  //   { name: "Item 7", image: "https://loremflickr.com/640/480" },
  //   { name: "Item 8", image: "https://loremflickr.com/640/480" },
  // ];

  // State to track items in each tier
  // const [tierItems, setTierItems] = useState<Record<TierName, string[]>>({
  //   S: [],
  //   A: [],
  //   B: [],
  //   C: [],
  //   D: [],
  //   unassigned: items.map((item) => item.name),
  // });

  const { isLoading, error, data } = await db.useQuery({
    $rooms: {
      rankings: {
        $: {
          where: {
            user: {},
          },
        },
      },
      $: {
        where: {
          id: roomId,
        },
      },
    },
  });

  console.log(data);

  // Function to handle item drop into a tier
  const handleDrop = (e: React.DragEvent, tierName: TierName) => {
    e.preventDefault();
    const itemName = e.dataTransfer.getData("text/plain");

    // Find which tier currently has this item
    let sourceTier: TierName = "unassigned";
    for (const [tier, tierItemList] of Object.entries(tierItems) as [
      TierName,
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
      newState[sourceTier] = newState[sourceTier].filter(
        (name) => name !== itemName
      );
      newState[tierName] = [...newState[tierName], itemName];
      return newState;
    });
  };

  // Find item by name
  const getItemByName = (name: string) => {
    return items.find((item) => item.name === name);
  };

  return (
    <div className="w-full pt-10">
      <div className="w-full md:w-3/4 mx-4 md:mx-auto">
        <h1 className="text-center w-full leading-16 text-2xl font-bold">
          Tier List
        </h1>
        <div className="flex flex-col">
          {tiers.map((tier) => (
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
                onDrop={(e) => handleDrop(e, tier.name as TierName)}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
              >
                {tierItems[tier.name as TierName].map((itemName) => {
                  const item = getItemByName(itemName);
                  if (!item) return null;

                  return (
                    <div
                      key={itemName}
                      className="w-12 h-12"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", itemName);
                      }}
                    >
                      <Image
                        width={100}
                        height={100}
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
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
            {tierItems.unassigned.map((itemName) => {
              const item = getItemByName(itemName);
              if (!item) return null;

              return (
                <div
                  key={item.name}
                  className="span-1 aspect-square"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", item.name);
                  }}
                >
                  <Image
                    width={100}
                    height={100}
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
