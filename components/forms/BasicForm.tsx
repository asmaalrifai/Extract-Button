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
      const response = await fetch(`/api/fetch-title?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      console.log('API Response:', data);
      if (Array.isArray(data.titles)) {
        const cleanTitles = data.titles.map((title: string) =>
          title.replace('<![CDATA[', '').replace(']]>', '')
        );
        setTitles(cleanTitles);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Failed to fetch title:', error);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    fetchTitle(values.url);
  };

  return (
    <div className="text-right">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl className="text-right">
                  <Input placeholder="Paste URL" {...field} />
                </FormControl>
                <FormDescription>
                  Enter a URL to extract its titles.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Fetch Titles</Button>
        </form>
      </Form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 mt-8 text-right">
        {titles.map((title, index) => (
          <div key={index} className="card p-4 bg-black rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicForm;
