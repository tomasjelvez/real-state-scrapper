import puppeteer from "puppeteer";
import { Property } from "@/types/property";

export async function scrapeProperties(url: string): Promise<Property[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1920, height: 1080 },
  });
  const properties: Property[] = [];

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    const elHandleArray = await page.$$(".ui-search-layout__item");

    elHandleArray.forEach(async (el) => {
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
        const href =
          element
            .querySelector(".poly-component__title")
            ?.getAttribute("href") || "";

        return { title, price, currency, location, features, imageUrl, href };
      });

      properties.push(propertyData);
    });

    return properties;
  } catch (error) {
    console.error("Scraping error:", error);
    return [];
  } finally {
    await browser.close();
  }
}
