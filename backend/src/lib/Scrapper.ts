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
               
        let collect : Collected[][] = await Promise.all([
            this.berskaScraping(this.path.berskaUrl),
            this.pullScraping(this.path.pullUrl),
            this.zalandoScraping(this.path.zalandoUrl)
        ]);    

        let data : Data = {
            berskaData : collect[0],
            pullData : collect[1],
            zalandoData : collect[2],
        }

        return data;

    }

    async berskaScraping(url : string) : Promise<Collected[]> {

        const browser = await puppeteer.launch({headless : true});

        const page = await browser.newPage();

        let images : string[] = [];

        let collected : Collected[] = [];

        page.on('response', async (response : HTTPResponse) => {

            if(response.url().includes('https://static.bershka.net/4/photos2') && response.url().includes("pg?imwidth=750")) images.push(response.url());
            
            if(response.url().includes('productsArray?categoryId')){

                let products = await response.json();

                for(let product of products.products){

                    let image : string | null = null;
                    let name : string | null = product.name;
                    let price: string | null = parseInt(product.bundleProductSummaries[0]?.detail.colors[0]?.sizes[0]?.price) / 100 + "" || null;

                    collected.push({
                        image : image,
                        price : price,
                        name : name
                    });
                    
                }

            }

        });

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36');

        await page.setViewport({width: 800, height: 600})

        await page.goto(url, { waitUntil: 'networkidle0' });

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

    async pullScraping(url : string) : Promise<Collected[]> {

        const browser = await puppeteer.launch({headless : true});

        const page = await browser.newPage();

        let images : string[] = [];

        let collected : Collected[] = [];

        page.on('response', async (response : HTTPResponse) => {


            if(response.url().includes('https://static.pullandbear.net/2/photos/') && (response.url().includes('imwidth=1920') || response.url().includes('&imwidth=750') || response.url().includes('&imwidth=850') || response.url().includes('imwidth=563'))){
                images.push(response.url());
            } 

            if(response.url().includes('productsArray?languageId=-5&productIds')){

                let products = await response.json();

                for(let product of products.products){

                    try{
                        let image : string | null = null;
                        let name : string | null = product.name;
                        let price: string | null = parseInt(product.bundleProductSummaries[0]?.detail.colors[0]?.sizes[0]?.price) / 100 + "" || null;
    
                        collected.push({
                            image : image,
                            price : price,
                            name : name
                        });
                    }catch{}
                    

                }

            }

        });

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36');

        await page.setViewport({width: 800, height: 600})

        await page.goto(url, { waitUntil: 'networkidle0' });

        while (true) {
        
            let initialPageHeight = await page.evaluate(() => document.body.scrollHeight);

            let targetElement = await page.$('.m-seo');
            let boundingBox = await targetElement!.boundingBox();

            await page.evaluate((scrollAmount) => {

                window.scrollBy(0, scrollAmount);
        
            }, boundingBox!.y - 850);

            await new Promise(resolve => setTimeout(resolve, 800));

            let finalPageHeight = await page.evaluate(() => document.body.scrollHeight);

            if(initialPageHeight == finalPageHeight) break;

        }

        collected = collected.map((item, index) => {
            return {...item,image: images[index]};
        });        

        await browser.close();

        return collected;

    }

    async zalandoScraping(url : string) : Promise<Collected[]> {

        const browser = await puppeteer.launch({headless : true});

        const page = await browser.newPage();

        await page.goto(url);

        await page.evaluate(() => {

            window.scrollBy(0, document.body.scrollHeight);

        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        let collected : Collected[] = await page.evaluate(() => {

            let prodcutsHandle = document.querySelectorAll("._5qdMrS.w8MdNG.cYylcv.BaerYO._75qWlu.iOzucJ.JT3_zV._Qe9k6");
            let data : Collected[] = [];

            for(let prd of prodcutsHandle){

                let titleHandle = prd.querySelector("header > div > h3.sDq_FX.lystZ1.FxZV-M.HlZ_Tf.ZkIJC-.r9BRio.qXofat.EKabf7.nBq1-s._2MyPg2");
                let imageHandle = prd.querySelector("div > div > img");

                let normalPriceHandle = prd.querySelectorAll("section > p > span.sDq_FX.lystZ1.FxZV-M.HlZ_Tf");
                let offerPriceHandle = prd.querySelectorAll("section > p.sDq_FX.lystZ1.dgII7d.HlZ_Tf > span:nth-child(2)");

                let priceHandle = normalPriceHandle.length > 0 ? normalPriceHandle : offerPriceHandle
                
                if(titleHandle && imageHandle && priceHandle.length > 0){

                    data.push({
                        name : titleHandle.textContent,
                        price : priceHandle[0].textContent,
                        image : (imageHandle as HTMLImageElement).src
                    });

                }

            }

            return data;

        });

        await browser.close();

        return collected;

    }

}