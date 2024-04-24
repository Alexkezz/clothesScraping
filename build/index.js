"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Scrapper_1 = __importDefault(require("./lib/Scrapper"));
const PATHS = {
    berskaUrl: "https://www.bershka.com/es/hombre/ropa/camisetas-c1010193239.html",
    zalandoUrl: "https://www.pullandbear.com/es/hombre/ropa/camisetas-n6323",
    pullUrl: ""
};
let scrapper = new Scrapper_1.default(PATHS);
scrapper.berskaScraping().then((res) => {
    console.log(res);
    console.log(res.length);
});
// scrapper.start().then((res : Data) => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// });
