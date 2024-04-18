const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch({ headless: false });

    const page = await browser.newPage();

    await page.goto('https://www.bershka.com/es/hombre/ropa/camisetas-c1010193239.html');

    await page.waitForSelector("#onetrust-accept-btn-handler")

    await page.click('#onetrust-accept-btn-handler')

    await page.waitForSelector(".grid-container");

    let initialPageHeight = await page.evaluate(() => document.body.scrollHeight);

    const scrollAmount = 1000;

    const data = [];

    while (true) {

        const liData = await page.$$eval('ul.grid-container li', liElements => {

            const data = [];

            liElements.forEach(li => {

                try{
                    const imageSrc = li.querySelector('img.image-item').getAttribute('src');
                    const paragraphText = li.querySelector('div.product-text > p').textContent;
                    const price = li.querySelector('span.current-price-elem').textContent;

                    data.push({
                        imageSrc,
                        paragraphText,
                        price
                    });
                    
                }
                catch{ }
                
            });

            return data;

        });

        const diff = liData.filter(item => !data.some(prevItem => prevItem.imageSrc === item.imageSrc));

        diff.forEach(element => {
            data.push(element);
        });

        await page.evaluate((scrollAmount) => {

            window.scrollBy(0, scrollAmount);

        }, scrollAmount);

        try {

            await page.waitForFunction(`document.body.scrollHeight > ${initialPageHeight}`, { timeout: 5000 });

        } catch (error) {

            console.log("Has llegado al final")
            break;

        }

        initialPageHeight = await page.evaluate(() => document.body.scrollHeight);
    }

    console.log(data.length);
    await browser.close();

})();
