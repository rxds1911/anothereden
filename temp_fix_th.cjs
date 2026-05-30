const fs = require("fs");
const cssPath = "C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css";
let css = fs.readFileSync(cssPath, "utf-8");
// Fix the transparent rule to only apply when colspan is present
css = css.replace(
  `.wiki-table thead tr:last-child th:first-child,

.wiki-table thead tr:last-child th:empty {
  background: transparent;
  border-bottom: none;
}`,
  `.wiki-table thead tr:last-child th:first-child:empty,

.wiki-table thead tr:last-child th:empty {
  background: transparent;
  border-bottom: none;
}`
);
fs.writeFileSync(cssPath, css, "utf-8");
console.log("Fixed");
