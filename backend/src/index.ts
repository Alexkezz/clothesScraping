import Scraper, { Collected } from "./lib/Scrapper";
import { Paths, Data } from "./lib/Scrapper";

const PATHS : Paths = {
    berskaUrl : "https://www.bershka.com/es/hombre/ropa/camisetas-c1010193239.html",
    pullUrl : "https://www.pullandbear.com/es/hombre/ropa/camisetas-n6323",
    zalandoUrl : "https://www.zalando.es/ropa-hombre-camisetas/"
}

let scrapper = new Scraper(PATHS);

console.log("START SCRAPPING...")

scrapper.pullScraping(PATHS.pullUrl).then((res : Collected[])  => {

    console.log(res);

})

// scrapper.start().then((res : Data) => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// });