import puppeteer from "puppeteer";

export async function scrapeLocations(searchText: string): Promise<string[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: { width: 1920, height: 1080 },
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://www.portalinmobiliario.com/", {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector('input[placeholder="Ingresa comuna o ciudad"]');
    await page.type(
      'input[placeholder="Ingresa comuna o ciudad"]',
      searchText,
      {
        delay: 100,
      }
    );

    await page.waitForSelector(".andes-list__item");
    const locations = await page.$$eval(".andes-list__item", (items) =>
      items
        .map((item) => item.textContent)
        .filter((text): text is string => text !== null)
    );

    return locations;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  } finally {
    await browser.close();
  }
}
