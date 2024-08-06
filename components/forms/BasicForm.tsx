"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
});

const BasicForm = () => {
  const [titles, setTitles] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const fetchTitle = async (url: string) => {
    try {
      const response = await fetch(
        `/api/fetch-title?url=${encodeURIComponent(url)}`
      );
      //the array
      const { title } = await response.json();
      setTitles((prevTitles) => [...prevTitles, title]);
    } catch (error) {
      console.error("Failed to fetch title:", error);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    fetchTitle(values.url);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="Paste URL" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a URL to extract its title.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Fetch Title</Button>
        </form>
      </Form>
      <div className="title-cards flex flex-wrap gap-4 mt-8">
        {titles.map((title, index) => (
          <div key={index} className="card p-4 bg-black rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Element: {title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicForm;
