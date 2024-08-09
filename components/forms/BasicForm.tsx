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

import SubmitButton from "../SubmitButton";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL" }),
});

const BasicForm = () => {
  const [isLoading, setisLoading] = useState(false);

  const [titles, setTitles] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const fetchTitle = async (url: string) => {
    try {
      setisLoading(true);
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
    } finally {
      setisLoading(false);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    fetchTitle(values.url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex justify-center items-center w-full max-w-[600px]"
        >
          <SubmitButton isLoading={isLoading}>استخراج العناوين</SubmitButton>
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
                    className="mr-[50px] text-right top-[40%] left-[50%]"
                  />
                </FormControl>
                <FormDescription className="text-right">
                  .الصق الرابط لاستخراج العناوين
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      {titles.length > 0 && (
        <div className="mt-4 w-full max-w-[800px]">
          <table className="w-full border-collapse mx-auto">
            <thead>
              <tr>
                <th className="bg-[#1b245e] text-white text-center border border-[#ddd] p-2">
                  العناوين
                </th>
                <th className="border border-[#ddd] p-2 text-right">#</th>
              </tr>
            </thead>
            <tbody>
              {titles.map((title, index) => (
                <tr
                  key={index}
                  className="even:bg-[#1b245e] even:text-white hover:bg-gray-600"
                >
                  <td className="border border-[#ddd] p-2 flex justify-between items-center">
                    <div>
                      <Button variant="Delete">حذف</Button>
                      <Button variant="Edit" className="mr-2">
                        تعديل
                      </Button>
                    </div>
                    {title}
                  </td>
                  <td className="border border-[#ddd] p-2 text-right">
                    {index + 1}
                  </td>
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
