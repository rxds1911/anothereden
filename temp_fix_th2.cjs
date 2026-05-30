const fs = require("fs");
const css = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", "utf-8");
// Replace the problematic block
const oldBlock = `.wiki-table thead tr:last-child th:first-child,

.wiki-table thead tr:last-child th:empty {

  background: transparent;
  
  border-bottom: none;
  
}`;

const newBlock = `.wiki-table thead tr:last-child th:first-child:empty {

  background: transparent;
  
  border-bottom: none;
  
}`;

if (css.includes(oldBlock)) {
  css = css.replace(oldBlock, newBlock);
  fs.writeFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", css, "utf-8");
  console.log("Fixed successfully");
} else {
  console.log("Old block not found. Looking for alternative...");
  // Try to find and fix by different approach - just remove the transparent background
  // Check lines around 354-360
  const lines = css.split("\n");
  for (let i = Math.max(0, 350); i < Math.min(lines.length, 370); i++) {
    if (lines[i].includes("transparent") || lines[i].includes("empty") || lines[i].includes("first-child")) {
      console.log(i, ":", lines[i]);
    }
  }
}
