import Scraper from "./lib/Scrapper";
import { Paths, Data } from "./lib/Scrapper";

const PATHS : Paths = {
    berskaUrl : "https://www.bershka.com/es/hombre/ropa/camisetas-c1010193239.html",
    zalandoUrl : "",
    pullUrl : ""
}

let scrapper = new Scraper(PATHS);

scrapper.start().then((res : Data) => {

    console.log(res);

}).catch(err => {

    console.log(err);

});