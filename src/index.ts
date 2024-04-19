import puppeteer from "puppeteer";

interface Paths {
    berskaUrl : string
    pullUrl : string
    zalandoUrl : string
}

interface Collected {
    name : string | undefined
    price : string | undefined
    image : string | undefined
}

interface Data {
    berskaData : Collected[]
    pullData : Collected[]
    zalandoData : Collected[]
}

class Scraper{

    private path : Paths;

    constructor(path : Paths){

        this.path = path;

    }

    async start(){
        
        let collect : Collected[][] = await this.scraping();
        
        let data : Data = {

            berskaData : collect[0],
            pullData : collect[1],
            zalandoData : collect[2],

        }

        return data;


    }

    async scraping() : Promise<Collected[][]>{

        return Promise.all(
            [
            this.berskaScraping(this.path.berskaUrl),
            this.pullScraping(this.path.pullUrl),
            this.zalandoScraping(this.path.zalandoUrl)
        ])

    }

    async berskaScraping(url : string) : Promise<Collected[]> {

        return new Promise((resolve, reject) => {

            let data : Collected[] = [];

            

            return data;


        })
        
    }

    async pullScraping(url : string) : Promise<Collected[]> {

        let data : Collected[] = [];


        return data;

    }

    async zalandoScraping(url : string) : Promise<Collected[]> {

        let data : Collected[] = [];


        return data;

    }

}