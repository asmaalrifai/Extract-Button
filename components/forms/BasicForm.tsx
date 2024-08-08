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
import styles from "./BasicForm.module.css";

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
      const data = await response.json();
      console.log("API Response:", data);
      if (Array.isArray(data.titles)) {
        const cleanTitles = data.titles.map((title: string) =>
          title.replace("<![CDATA[", "").replace("]]>", "")
        );
        setTitles(cleanTitles);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Failed to fetch title:", error);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    fetchTitle(values.url);
  };

  return (
    <div className={styles.container}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Paste URL"
                    {...field}
                    className={styles.input}
                  />
                </FormControl>
                <FormDescription>
                  Enter a URL to extract its titles.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className={styles.button}>
            Fetch Titles
          </Button>
        </form>
      </Form>
      {titles.length > 0 && (
        <div className={styles.titles}>
          <h3>Titles:</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              {titles.map((title, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BasicForm;
