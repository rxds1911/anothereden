const fs = require("fs");
const cssPath = "C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css";
let css = fs.readFileSync(cssPath, "utf-8");
css += `
.wiki-table td strong {
  color: #1a2940;
}
`;
fs.writeFileSync(cssPath, css, "utf-8");
console.log("Added CSS override");
