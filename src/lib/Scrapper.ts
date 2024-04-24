import puppeteer, { Browser, ElementHandle, HTTPResponse } from "puppeteer";

export interface Paths {
    berskaUrl : string
    pullUrl : string
    zalandoUrl : string
}

export interface Collected {
    name : string | null
    price : string | null
    image : string | null
}

export interface Data {
    berskaData : Collected[]
    pullData : Collected[]
    zalandoData : Collected[]
}

export default class Scraper{

    private path : Paths;

    constructor(path : Paths){
        this.path = path;
    }

    async start(){
        
        const browser = await puppeteer.launch({ headless: false });
        let collect : Collected[][] = await this.scraping(browser);
        await browser.close();

        let data : Data = {
            berskaData : collect[0],
            pullData : collect[1],
            zalandoData : collect[2],
        }

        return data;

    }

    async scraping(browser : Browser) : Promise<Collected[][]>{

        return Promise.all(
            [
            // this.berskaScraping(this.path.berskaUrl, browser),
            //this.pullScraping(this.path.pullUrl, browser),
            //this.zalandoScraping(this.path.zalandoUrl, browser)
        ]);        

    }

    async berskaScraping() : Promise<Collected[]> {
        
        const browser = await puppeteer.launch({ headless: false });

        const url = "https://www.bershka.com/es/hombre/ropa/camisetas-c1010193239.html";

        const page = await browser.newPage();

        await page.goto(url);

        await page.waitForSelector("#onetrust-accept-btn-handler")

        await page.click('#onetrust-accept-btn-handler')

        await new Promise(resolve => setTimeout(resolve, 2000));

        let collected : Collected[] = [];

        let images : string[] = [];

        page.on('response', async (response : HTTPResponse) => {

            if(response.url().includes('https://static.bershka.net/4/photos2')) images.push(response.url());
            
            if(response.url().includes('productsArray?categoryId')){

                let res = await response.json();

                res.products.forEach((product : any) => {

                    try{
                        collected.push({
                            image : null,
                            price : parseInt(product.bundleProductSummaries[0].detail.colors[0].sizes[0].price) / 100 + "" || null,
                            name : product.name
                        });
                    }catch{}
                    

                });

            }

        });

        let initialPageHeight : number = await page.evaluate(() => document.body.scrollHeight);
        const scrollAmount : number = 1000;

        while (true) {

            await page.evaluate((scrollAmount) => {

                window.scrollBy(0, scrollAmount);

            }, scrollAmount);

            try {

                await page.waitForFunction(`document.body.scrollHeight > ${initialPageHeight}`, { timeout: 5000 });

            } catch (error) {

                break;

            }

            initialPageHeight = await page.evaluate(() => document.body.scrollHeight);

        }

        collected = collected.map((item, index) => {
            return {...item,image: images[index]};
        });        

        await browser.close();
        
        return collected;
        
    }

    async pullScraping() : Promise<Collected[]> {

        const browser = await puppeteer.launch({ headless: false });

        const url = "https://www.pullandbear.com/es/hombre/ropa/camisetas-n6323";

        const page = await browser.newPage();

        await page.goto(url);

        await page.waitForSelector("#onetrust-accept-btn-handler")

        await page.click('#onetrust-accept-btn-handler')

        await page.waitForSelector("grid-generator");

        let collected : Collected[] = [];

        let images : string[] = [];

        page.on('response', async (response : HTTPResponse) => {

            if(response.url().includes('https://static.pullandbear.net/2/photos')) images.push(response.url());
            
            if(response.url().includes('productsArray?languageId=-5&productIds')){

                let res = await response.json();

                res.products.forEach((product : any) => {

                    collected.push({
                        image : null,
                        price : parseInt(product.bundleProductSummaries[0].detail.colors[0].sizes[0].price) / 100 + "",
                        name : product.name
                    });

                });

            }

        });

        while (true) {
        
            let initialPageHeight = await page.evaluate(() => document.body.scrollHeight);

            let targetElement = await page.$('.m-seo');
            let boundingBox = await targetElement!.boundingBox();

            await page.evaluate((scrollAmount) => {

                window.scrollBy(0, scrollAmount);
        
            }, boundingBox!.y - 800);

            await new Promise(resolve => setTimeout(resolve, 500));

            let finalPageHeight = await page.evaluate(() => document.body.scrollHeight);

            if(initialPageHeight == finalPageHeight) break;

        }

        collected = collected.map((item, index) => {
            return {...item,image: images[index]};
        });        

        await browser.close();

        return collected;

    }

    async zalandoScraping(url : string, browser : Browser) : Promise<Collected[]> {

        return new Promise((resolve, reject) => {
            let data : Collected[] = [];
            resolve(data);
        })

    }

}