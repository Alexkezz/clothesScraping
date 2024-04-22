const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.goto('https://www.pullandbear.com/es/hombre/ropa/camisetas-n6323');

    await page.waitForSelector("#onetrust-accept-btn-handler");

    await page.click("#onetrust-accept-btn-handler");

    await page.waitForSelector("grid-generator");

    await new Promise(resolve => setTimeout(resolve, 2000));

    let targetElement = await page.$('.m-seo');

    let boundingBox = await targetElement.boundingBox();

    await page.evaluate((scrollAmount) => {

        window.scrollBy(0, scrollAmount);

    }, boundingBox.y - 800);

    await new Promise(resolve => setTimeout(resolve, 2000));

    targetElement = await page.$('.m-seo');
    boundingBox = await targetElement.boundingBox();

    await page.evaluate((scrollAmount) => {

        window.scrollBy(0, scrollAmount);

    }, boundingBox.y - 800);

    // await targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

})();