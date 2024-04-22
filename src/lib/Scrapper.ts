import puppeteer, { Browser, ElementHandle } from "puppeteer";

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
            this.berskaScraping(this.path.berskaUrl, browser),
            //this.pullScraping(this.path.pullUrl, browser),
            //this.zalandoScraping(this.path.zalandoUrl, browser)
        ]);        

    }

    async berskaScraping(url : string, browser : Browser) : Promise<Collected[]> {
        
        let collected : Collected[] = [];

        const page = await browser.newPage();

        await page.goto(url);

        await page.waitForSelector("#onetrust-accept-btn-handler")

        await page.click('#onetrust-accept-btn-handler')

        await page.waitForSelector(".grid-container");

        let initialPageHeight : number = await page.evaluate(() => document.body.scrollHeight);

        const scrollAmount : number = 1000;

        while (true) {

            const liData = await page.$$eval('ul.grid-container li', (liElements : HTMLElement[]) => {

                let tmp : Collected[] = [];

                liElements.forEach((li : HTMLElement) => {

                    let collect : Collected = {
                        image : li.querySelector('img.image-item')?.getAttribute('src') || null,
                        name : li.querySelector('div.product-text > p')?.textContent || null,
                        price : li.querySelector('span.current-price-elem')?.textContent || null
                    }

                    if(collect.image != null && collect.name != null && collect.price != null){
                        tmp.push(collect);
                    }
                    
                });

                return tmp;

            });

            const diff : Collected[] = liData.filter(item => !collected.some((prevItem : Collected) => prevItem.image === item.image));

            diff.forEach(element => {
                collected.push(element);
            });

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

        await new Promise(resolve => setTimeout(resolve, 2000));

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

        const collected : Collected[] = await page.$$eval('legacy-product', (liElements : any) => {

            let tmp : Collected[] = [];

            liElements.forEach((li : HTMLElement) => {

                let collect : Collected = {
                    image : li.querySelector('img.image-responsive')?.getAttribute('src') || null,
                    name : li.querySelector('div.name > span')?.textContent || null,
                    price : li.querySelector('div.product-price > div')?.textContent || null
                }

                tmp.push(collect);
                
                
            });

            return tmp;

        });

        await browser.close();

        console.log(collected.length)

        return collected;

    }

    async zalandoScraping(url : string, browser : Browser) : Promise<Collected[]> {

        return new Promise((resolve, reject) => {
            let data : Collected[] = [];
            resolve(data);
        })

    }

}