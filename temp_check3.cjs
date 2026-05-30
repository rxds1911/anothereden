const fs = require("fs");
const h = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", "utf-8");
console.log("=== Content 5200 to 5500 ===");
console.log(h.substring(5200, 5500));
console.log("\n=== Content 6600 to 6800 ===");
console.log(h.substring(6600, 6800));
console.log("\n=== Content 9600 to end ===");
console.log(h.substring(9600));
