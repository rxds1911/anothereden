const fs = require("fs");
const css = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", "utf-8");
// Fix the accidental wiki-section-header padding change
css = css.replace("padding: 10px 0 10px 0;", "padding: 10px 20px;");
fs.writeFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", css, "utf-8");
console.log("Fixed wiki-section-header padding back");
