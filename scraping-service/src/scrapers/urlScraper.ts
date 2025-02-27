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

    // Block unnecessary resources to speed up loading
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (
        req.resourceType() === "image" ||
        req.resourceType() === "stylesheet" ||
        req.resourceType() === "font" ||
        req.resourceType() === "media"
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const baseUrl = "https://www.portalinmobiliario.com";
    const searchUrl = `${baseUrl}/${operation}/${propertyType}`;

    // Use faster page load strategy
    await page.goto(searchUrl, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    await page.waitForSelector('input[placeholder="Ingresa comuna o ciudad"]');
    await page.type('input[placeholder="Ingresa comuna o ciudad"]', location, {
      delay: 50,
    });

    // Wait for and click the first suggestion with better error handling
    try {
      await page.waitForSelector(".andes-list__item-action", { timeout: 5000 });
      await page.click(".andes-list__item-action");
    } catch (error) {
      console.log("No suggestions found, trying direct search", error);
      await page.keyboard.press("Enter");
    }

    // Wait for and click search with better error handling
    try {
      await page.waitForSelector(
        ".andes-button.faceted-search-desktop__elem-actions.andes-button--large.andes-button--loud",
        { timeout: 5000 }
      );
      await page.click(
        ".andes-button.faceted-search-desktop__elem-actions.andes-button--large.andes-button--loud"
      );
    } catch (error) {
      console.log(
        "Search button not found, page might have already updated",
        error
      );
    }

    // Wait for either the map link or search results to appear
    await Promise.race([
      page.waitForSelector(".ui-search-toolbar__link", { timeout: 10000 }),
      page.waitForSelector(".ui-search-layout__item", { timeout: 10000 }),
    ]);

    // Get the clean URL from either the map link or current URL
    const cleanUrl = await page.evaluate(() => {
      const mapLink = document.querySelector(".ui-search-toolbar__link");
      if (mapLink) {
        const href = mapLink.getAttribute("href");
        return href?.replace("/_DisplayType_M", "") || window.location.href;
      }
      return window.location.href;
    });

    console.log("Search URL:", cleanUrl);
    return cleanUrl;
  } catch (error) {
    console.error("Error getting search URL:", error);
    throw error;
  } finally {
    await browser.close().catch(console.error);
  }
}
