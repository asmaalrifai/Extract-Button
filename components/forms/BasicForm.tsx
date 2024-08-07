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
    <div className="p-4 ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-end space-y-4">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button className="mt-2 p-5" type="submit">
              Fetch Titles
            </Button>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">URL</FormLabel>
                  <FormControl>
                    <Input className="text-right" placeholder="الصق الرابط" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormDescription className="text-right">
            Enter a URL to extract its titles.
          </FormDescription>
          <FormMessage />
        </form>
      </Form>
      <div className="text-right grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        {titles.map((title, index) => (
          <div
            key={index}
            className="card p-4 bg-card text-card-foreground rounded-lg shadow-md border border-border hover:bg-gray-600 hover:cursor-pointer"
          >
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasicForm;
