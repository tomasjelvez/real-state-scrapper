import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

export async function scrapeSearchUrl(
  operation: string,
  propertyType: string,
  location: string
): Promise<string> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    console.log(
      "Starting search simulation for:",
      operation,
      propertyType,
      location
    );
    const page = await browser.newPage();

    const baseUrl = "https://www.portalinmobiliario.com";
    const searchUrl = `${baseUrl}/${operation}/${propertyType}`;

    await page.goto(searchUrl, { waitUntil: "networkidle2" });
    console.log("Page loaded:", searchUrl);

    // Close tooltip if it appears
    try {
      await page.waitForSelector(".andes-tooltip-button-close", {
        timeout: 3000,
      });
      await page.click(".andes-tooltip-button-close");
      console.log("Tooltip closed");
    } catch {
      console.log("Tooltip did not appear");
    }

    // Wait for search input and type location
    await page.waitForSelector('input[placeholder="Ingresa comuna o ciudad"]', {
      timeout: 10000,
    });

    await page.type('input[placeholder="Ingresa comuna o ciudad"]', location, {
      delay: 100,
    });
    console.log("Typed location:", location);

    // Wait for autocomplete suggestions
    await page.waitForSelector(".andes-list__item-action", { timeout: 10000 });
    console.log("Suggestions loaded");

    // Click the first suggestion
    await page.click(".andes-list__item-action");
    console.log("Suggestion clicked");

    // Give time to confirm selection
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Click search button
    await page.waitForSelector(
      ".andes-button.faceted-search-desktop__elem-actions.andes-button--large.andes-button--loud",
      { timeout: 10000 }
    );
    await page.click(
      ".andes-button.faceted-search-desktop__elem-actions.andes-button--large.andes-button--loud"
    );
    console.log("Search button clicked");

    // Wait for navigation
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    console.log("Navigation completed");

    console.log("Final URL:", page.url());
    return page.url();
  } catch (error) {
    console.error("Error during search:", error);
    throw error;
  } finally {
    await browser.close();
  }
}
