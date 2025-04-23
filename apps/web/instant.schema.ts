// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    // $files: i.entity({
    //   path: i.string().unique().indexed(),
    //   url: i.any(),
    // }),
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    lists: i.entity({
      code: i.string().unique().indexed(),
      name: i.string(),
      description: i.json(),
      tiers: i.json(),
      items: i.json(),
      rankings: i.json(),
    }),
    rankings: i.entity({
      ranked: i.json(),
      unranked: i.json(),
    }),
  },
  rooms: {
    tierList: {
      presence: i.entity({
        name: i.string(),
        status: i.string(),
      }),
    },
  },
  links: {
    userRoom: {
      forward: {
        on: "$users",
        has: "many",
        label: "lists",
      },
      reverse: {
        on: "lists",
        has: "many",
        label: "users",
      },
    },
    roomRanking: {
      forward: {
        on: "lists",
        has: "many",
        label: "rankings",
      },
      reverse: {
        on: "rankings",
        has: "many",
        label: "roomRanked",
      },
    },
    userRanking: {
      forward: {
        on: "$users",
        has: "many",
        label: "userRanking",
      },
      reverse: {
        on: "rankings",
        has: "one",
        label: "user",
      },
    },
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
