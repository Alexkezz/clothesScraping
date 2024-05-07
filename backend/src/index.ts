import Scraper from "./lib/Scrapper";
import { Paths, Data } from "./lib/Scrapper";
import express from "express";

const PORT = 3000;
const app = express();

const PATHS : Paths = {
    berskaUrl : "https://www.bershka.com/es/hombre/ropa/camisetas-c1010193239.html",
    pullUrl : "https://www.pullandbear.com/es/hombre/ropa/camisetas-n6323",
    zalandoUrl : "https://www.zalando.es/ropa-hombre-camisetas/"
}

let scrapper = new Scraper(PATHS);

app.use(express.json());

app.get("/", (req, res) => {
    console.log("Connected!")
});

app.listen(PORT, () => {

    console.log(`Running on port ${PORT}`);

});