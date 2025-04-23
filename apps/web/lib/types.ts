import schema from "@/instant.schema";
import { InstaQLEntity } from "@instantdb/react";

export type TierRoom = InstaQLEntity<typeof schema, "lists">;
export type TierRanking = InstaQLEntity<typeof schema, "rankings">;
export type TierUser = InstaQLEntity<typeof schema, "$users">;

// export type TierRoom = {
//   tiers: Array<Tier>;
//   items: Array<TierItem>;
//   userRankings: UserRankings;
// };

export type UserRankings = Map<string, TierList>;

export type TierList = {
  tiers: Map<string, Array<TierItem>>;
  unlisted: Array<TierItem>;
};

export type TierItem = {
  name: string;
  image: string;
};

export type Tier = {
  name: string;
  color: string;
  items: Array<TierItem>;
};
