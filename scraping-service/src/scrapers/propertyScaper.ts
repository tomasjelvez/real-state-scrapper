import puppeteer from "puppeteer";
import { Property } from "../types/property";
import dotenv from "dotenv";
import { MINIMAL_ARGS } from "../lib/data/scrapeBowserArgs";

dotenv.config();

export async function scrapeProperties(url: string): Promise<Property[]> {
  console.log("Scraping properties from:", url);
  const properties: Property[] = [];
  const browser = await puppeteer.launch({
    args: MINIMAL_ARGS,
    headless: true,
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    const page = await browser.newPage();

    // Block unnecessary resources
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        req.resourceType() === "image" ||
        req.resourceType() === "stylesheet" ||
        req.resourceType() === "font"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    await page.waitForSelector(".ui-search-layout__item", { timeout: 10000 });
    const elHandleArray = await page.$$(".ui-search-layout__item");

    for (const el of elHandleArray) {
      const propertyData = await el.evaluate((element): Property => {
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
        const imageEl = element.querySelector(".poly-component__picture");
        const imageUrl =
          imageEl?.getAttribute("data-src") ||
          imageEl?.getAttribute("src") ||
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
          href,
          propertyId,
        };
      });

      properties.push(propertyData);
    }

    return properties;
  } catch (error) {
    console.error("Scraping error:", error);
    return [];
  } finally {
    await browser.close().catch(console.error);
  }
}
