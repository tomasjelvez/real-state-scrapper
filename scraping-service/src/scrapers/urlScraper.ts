import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { MINIMAL_ARGS } from "../lib/data/scrapeBowserArgs";

dotenv.config();

export async function scrapeSearchUrl(
  operation: string,
  propertyType: string,
  location: string
): Promise<string> {
  const browser = await puppeteer.launch({
    args: MINIMAL_ARGS,
    headless: true,
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    console.log("Scraping search URL for:", operation, propertyType, location);
    const page = await browser.newPage();
    const baseUrl = "https://www.portalinmobiliario.com";
    const searchUrl = `${baseUrl}/${operation}/${propertyType}/${location}`;

    await page.goto(searchUrl, { waitUntil: "networkidle2" });
    await page.waitForSelector('input[placeholder="Ingresa comuna o ciudad"]');
    await page.type('input[placeholder="Ingresa comuna o ciudad"]', location, {
      delay: 100,
    });

    await page.waitForSelector(".andes-list__item");
    await page.click(".andes-list__item");
    await page.waitForSelector(".andes-button--loud");
    await page.click(".andes-button--loud");
    await page.waitForNavigation();

    console.log("Search URL:", page.url());
    return page.url();
  } catch (error) {
    console.error("Error getting search URL:", error);
    throw error;
  } finally {
    await browser.close();
  }
}
