const fs = require("fs");
const cssPath = "C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css";
let css = fs.readFileSync(cssPath, "utf-8");
// Add override rules at the end
css += `
.skill-type-heading {
  margin-left: 0 !important;
  padding-left: 0 !important;
}
.wiki-table th:first-child,
.wiki-table td:first-child {
  padding-left: 4px !important;
}
`;
fs.writeFileSync(cssPath, css, "utf-8");
console.log("Added override rules");
