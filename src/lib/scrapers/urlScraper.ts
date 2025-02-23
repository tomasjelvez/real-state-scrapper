import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function scrapeSearchUrl(
  operation: string,
  propertyType: string,
  location: string
): Promise<string> {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  try {
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

    return page.url();
  } catch (error) {
    console.error("Error getting search URL:", error);
    throw error;
  } finally {
    await browser.close();
  }
}
