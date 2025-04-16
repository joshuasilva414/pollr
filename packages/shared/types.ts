export type TierRoom = {
  tiers: Array<Tier>;
  items: Array<TierItem>;
  userRankings: UserRankings;
};

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
  items: Array<TierItem>;
};
