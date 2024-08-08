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
          <Button type="submit" className={styles.button}>
            استخراج العناوين
          </Button>
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>عنوان الموقع</FormLabel>
                <FormControl>
                  <Input
                    placeholder="الصق الرابط"
                    {...field}
                    className={styles.input}
                  />
                </FormControl>
                <FormDescription>
                  .الصق الرابط لاستخراج العناوين
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {titles.length > 0 && (
        <div className={styles.titles}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>العناوين</th>
                <th>#</th>
              </tr>
            </thead>
            <tbody>
              {titles.map((title, index) => (
                <tr key={index}>
                  <td>{title}</td>
                  <td>{index + 1}</td>
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
