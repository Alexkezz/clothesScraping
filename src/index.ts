import Scraper, { Collected } from "./lib/Scrapper";
import { Paths, Data } from "./lib/Scrapper";

const PATHS : Paths = {
    berskaUrl : "https://www.bershka.com/es/hombre/ropa/camisetas-c1010193239.html",
    zalandoUrl : "https://www.pullandbear.com/es/hombre/ropa/camisetas-n6323",
    pullUrl : ""
}

let scrapper = new Scraper(PATHS);

scrapper.berskaScraping().then((res : Collected[]) =>{

    console.log(res);

    console.log(res.length);

});


// scrapper.start().then((res : Data) => {

//     console.log(res);

// }).catch(err => {

//     console.log(err);

// });