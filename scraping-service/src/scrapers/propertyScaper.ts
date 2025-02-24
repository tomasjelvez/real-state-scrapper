import puppeteer from "puppeteer";
import { Property } from "../types/property";

export async function scrapeProperties(url: string): Promise<Property[]> {
  console.log("Scraping properties from:", url);
  const properties: Property[] = [];
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: { width: 1920, height: 1080 },
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    const elHandleArray = await page.$$(".ui-search-layout__item");

    for (const el of elHandleArray) {
      const propertyData = await el.evaluate((element) => {
        const title =
          element.querySelector(".poly-component__title")?.textContent || "";
        const price =
          element.querySelector(".andes-money-amount__fraction")?.textContent ||
          "";
        const currency = (
          element.querySelector(".andes-money-amount__currency-symbol")
            ?.textContent === "UF"
            ? "UF"
            : "CLP"
        ) as "UF" | "CLP";
        const location =
          element.querySelector(".poly-component__location")?.textContent || "";
        const features = Array.from(
          element.querySelectorAll(".poly-attributes-list__item")
        ).map((item) => item.textContent || "");
        const imageUrl =
          element
            .querySelector(".poly-component__picture")
            ?.getAttribute("data-src") ||
          element
            .querySelector(".poly-component__picture")
            ?.getAttribute("src") ||
          "";
        const fullHref =
          element
            .querySelector(".poly-component__title")
            ?.getAttribute("href") || "";

        // Clean href by removing everything after '#'
        const href = fullHref.split("#")[0];

        // Extract propertyId from MLC-XXXXXXXXX pattern
        const propertyId = href.match(/MLC-(\d+)/)?.[1] || "";

        return {
          title,
          price,
          currency,
          location,
          features,
          imageUrl,
          href, // Clean href without tracking params
          propertyId, // Just the numeric ID
        };
      });

      properties.push(propertyData);
    }

    return properties;
  } catch (error) {
    console.error("Scraping error:", error);
    return [];
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
