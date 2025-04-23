import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  tiers: z
    .array(
      z.object({
        name: z.string().min(1),
        color: z.string().min(1).max(7),
      })
    )
    .nonempty(),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        image: z.string().min(1),
      })
    )
    .nonempty(),
});

export const tierListSchema = z.map(
  z.string().min(1),
  z.array(
    z.object({
      name: z.string().min(1),
      image: z.string().min(1),
    })
  )
);
