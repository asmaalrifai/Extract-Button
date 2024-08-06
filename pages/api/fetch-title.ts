import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cheerio from "cheerio";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const title = $("title").text();

    res.status(200).json({ title });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the title" });
  }
};
