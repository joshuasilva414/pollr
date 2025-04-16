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
    $rooms: i.entity({
      code: i.string().unique().indexed(),
      name: i.string(),
      description: i.json(),
      tiers: i.json(),
      items: i.json(),
    }),
    ranking: i.entity({}),
  },
  links: {
    userRoom: {
      forward: {
        on: "$users",
        has: "many",
        label: "rooms",
      },
      reverse: {
        on: "$rooms",
        has: "many",
        label: "users",
      },
    },
    roomRanking: {
      forward: {
        on: "$rooms",
        has: "many",
        label: "rankings",
      },
      reverse: {
        on: "ranking",
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
        on: "ranking",
        has: "one",
        label: "user",
      },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
