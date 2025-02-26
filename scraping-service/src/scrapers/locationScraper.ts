import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { MINIMAL_ARGS } from "../lib/data/scrapeBowserArgs";

dotenv.config();

export async function scrapeLocations(searchText: string): Promise<string[]> {
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

    await page.goto("https://www.portalinmobiliario.com/", {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });

    const inputSelector = 'input[placeholder="Ingresa comuna o ciudad"]';
    await page.waitForSelector(inputSelector, { timeout: 5000 });
    await page.type(inputSelector, searchText, { delay: 50 });

    const listSelector = ".andes-list__item";
    await page.waitForSelector(listSelector, { timeout: 5000 });

    const locations = await page.$$eval(".andes-list__item", (items) =>
      items
        .map((item) => item.textContent?.trim())
        .filter((text): text is string => text !== null && text !== undefined)
    );

    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  } finally {
    await browser.close().catch(console.error);
  }
}
