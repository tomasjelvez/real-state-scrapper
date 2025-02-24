import express, { Request, Response } from "express";
import cors from "cors";
import { scrapeLocations } from "../src/scrapers/locationScraper";
import { scrapeProperties } from "../src/scrapers/propertyScaper";
import { scrapeSearchUrl } from "../src/scrapers/urlScraper";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/scrape/locations", async (req: Request, res: Response) => {
  try {
    const { searchText } = req.body;
    if (!searchText || searchText.length < 3) {
      return res.json([]);
    }
    const locations = await scrapeLocations(searchText);
    res.json(locations);
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ error: "Failed to scrape locations" });
  }
});

app.post("/scrape/properties", async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    const properties = await scrapeProperties(url);
    res.json(properties);
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ error: "Failed to scrape properties" });
  }
});

app.post("/scrape/url", async (req, res) => {
  try {
    const { operation, propertyType, location } = req.body;
    const url = await scrapeSearchUrl(operation, propertyType, location);
    res.json({ url });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ error: "Failed to scrape search URL" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Scraper service running on port ${PORT}`));
