"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoomSchema } from "@/lib/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
export default function Page() {
  const form = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      tiers: [
        { name: "S", color: "#ff7f7f" },
        { name: "A", color: "#ffbf7f" },
        { name: "B", color: "#ffdf7f" },
        { name: "C", color: "#ffff7f" },
        { name: "D", color: "#bfff7f" },
        { name: "E", color: "#9fff7f" },
        { name: "F", color: "#7fff7f" },
      ],
      items: [
        { name: "Item 1", image: "https://via.placeholder.com/150" },
        { name: "Item 2", image: "https://via.placeholder.com/150" },
        { name: "Item 3", image: "https://via.placeholder.com/150" },
      ],
    },
  });
  const items = useFieldArray({
    control: form.control,
    name: "items",
  });
  const tiers = useFieldArray({
    control: form.control,
    name: "tiers",
  });

  const onSubmit = (data: z.infer<typeof createRoomSchema>) => {
    console.log(data);
  };

  return (
    <div className="w-full pt-10">
      <div className="w-full md:w-3/4 mx-4 md:mx-auto">
        <h1 className="text-center w-full leading-16 text-2xl font-bold">
          Create Tier List
        </h1>
        <div className="flex flex-col gap-4 border rounded-lg p-4">
          <Form {...form}>
            <form
              className="flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <FormLabel>Tiers</FormLabel>
                  {tiers.fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`tiers.${index}.name`}
                      render={({ field }) => (
                        <FormItem
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData(
                              "text/plain",
                              index.toString()
                            );
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            const fromIndex = parseInt(
                              e.dataTransfer.getData("text/plain")
                            );
                            const toIndex = index;
                            tiers.move(fromIndex, toIndex);
                          }}
                          className="cursor-move flex items-center gap-1 before:content-['::'] before:text-xs before:text-gray-500 before:mr-1"
                        >
                          <FormControl>
                            <div className="flex gap-1">
                              <Input {...field} placeholder="Tier name" />
                              <Input
                                type="color"
                                {...form.register(`tiers.${index}.color`)}
                                className="w-12 h-9 px-1"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => tiers.remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    onClick={() => tiers.append({ name: "", color: "#000000" })}
                  >
                    Add Tier
                  </Button>
                </div>
                <div className="flex flex-col gap-2">
                  <FormLabel>Items</FormLabel>
                  {items.fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`items.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex gap-1">
                              <Input {...field} />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => items.remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    onClick={() => items.append({ name: "", image: "" })}
                  >
                    Add Item
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full mt-4">
                Create
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
