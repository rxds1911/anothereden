const fs = require("fs");
let css = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", "utf-8");
css = css.replace(
  `margin-left: 0 !important;
  padding-left: 0 !important;`,
  `margin: 16px 0 8px 0 !important;
  padding: 4px 0 !important;`
);
fs.writeFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", css, "utf-8");
console.log("Updated");
