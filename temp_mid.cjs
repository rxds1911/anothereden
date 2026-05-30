const fs = require("fs");
const h = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", "utf-8");
// Print content from 3600 to 5300
console.log(h.substring(3600, 5400));
