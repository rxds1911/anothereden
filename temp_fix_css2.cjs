const fs = require("fs");
const css = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", "utf-8");
// Add color to wiki-table td by replacing the closing brace
const oldRule = `.wiki-table td {

  padding: 8px 14px;
  
  border-bottom: 1px solid #eee;
  
  font-size: .85rem;
  
}`;
const newRule = `.wiki-table td {

  padding: 8px 14px;
  
  border-bottom: 1px solid #eee;
  
  font-size: .85rem;
  
  color: #333;
  
}`;
if (css.includes(oldRule)) {
  const updated = css.replace(oldRule, newRule);
  fs.writeFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", updated, "utf-8");
  console.log("Updated wiki-table td with color");
} else {
  console.log("Pattern not found exactly, checking with normalized...");
  const n = css.replace(/\n\s*\n/g, "\n");
  console.log("Normalized has .wiki-table td:", n.includes(".wiki-table td"));
}
