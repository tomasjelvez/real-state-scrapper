import express from "express";
import cors from "cors";
import { scrapeLocations } from "./scrapers/locationScraper";
import { scrapeProperties } from "./scrapers/propertyScaper";
import { scrapeSearchUrl } from "./scrapers/urlScraper";

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
    methods: ["GET"],
  })
);

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Scraping service is running" });
});

app.get("/api/locations", async (req, res) => {
  try {
    const search = (req.query.search as string) || "";
    if (search.length < 3) {
      return res.json([]);
    }
    const locations = await scrapeLocations(search);
    res.json(locations);
  } catch (error) {
    console.error("Error in locations endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/urls", async (req, res) => {
  try {
    const operation = (req.query.operation as string) || "";
    const propertyType = (req.query.propertyType as string) || "";
    const location = (req.query.location as string) || "";

    if (location.length > 0) {
      const url = await scrapeSearchUrl(operation, propertyType, location);
      res.json(url);
    } else {
      res.json("");
    }
  } catch (error) {
    console.error("Error in urls endpoint:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/properties", async (req, res) => {
  try {
    const url = (req.query.url as string) || "";
    const properties = await scrapeProperties(url);

    if (!properties.length) {
      return res.status(404).json({ message: "No se encontraron propiedades" });
    }

    res.json(properties);
  } catch (error) {
    console.error("Error in properties endpoint:", error);
    res.status(500).json({ error: "Error al buscar propiedades" });
  }
});

app.listen(port, () => {
  console.log(`Scraping service running on port ${port}`);
});
