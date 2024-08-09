import type { NextApiRequest, NextApiResponse } from "next";
import { parseStringPromise } from "xml2js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { url } = req.query;
    if (!url || typeof url !== "string") {
      console.error("Invalid URL parameter:", url);
      return res.status(400).json({ error: "Invalid URL parameter" });
    }

    // Fetch the XML content from the URL
    const response = await fetch(url as string);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch from URL: ${url}, status: ${response.status}`
      );
    }

    const xmlText = await response.text();

    // Parse XML and extract titles using xml2js
    const result = await parseStringPromise(xmlText);
    const titles = result.rss.channel[0].item.map(
      (item: { title: string }) => item.title[0]
    );

    console.log("Extracted titles:", titles);
    return res.status(200).json({ titles });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
