const puppeteer = require('puppeteer');

(async () => {
    
    const browser = await puppeteer.launch({headless : false});

    const page = await browser.newPage();

    await page.goto('https://www.bershka.com/es/hombre/ropa/camisetas-c1010193239.html');

    await page.waitForSelector("#onetrust-accept-btn-handler")

    await page.click('#onetrust-accept-btn-handler')

    await page.waitForSelector(".grid-container");

    let data = []

    page.on('response', async (response) => {
        
        if (response.url().includes('productsArray?categoryId')) {
          
            const responseData = await response.json();

            responseData["products"].forEach(product => {

                try{

                    let objProduct = {
                        name : product["name"],
                        price : product["bundleProductSummaries"][0]["detail"]["colors"][0]["sizes"][0]["price"],
                        img : product["bundleProductSummaries"][0]["detail"]["colors"][0]["image"]["url"]
                    }

                    let isImageInArray = data.some(product => product.name === objProduct.name);

                    if(!isImageInArray){

                        data.push(objProduct);

                    }

                }
                catch{

                }
                

            });

        }
        
    });

    let initialPageHeight = await page.evaluate(() => document.body.scrollHeight);

    const scrollAmount = 1000;

    while(true) {
        
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

})();
