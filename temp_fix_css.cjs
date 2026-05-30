const fs = require("fs");
const css = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", "utf-8");
// Add color to wiki-table td
const updated = css.replace(/.wiki-table td {\n  padding: 8px 14px;\n  border-bottom: 1px solid #eee;\n  font-size: .85rem;/g,
  '.wiki-table td {\n  padding: 8px 14px;\n  border-bottom: 1px solid #eee;\n  font-size: .85rem;\n  color: #333;');
if (updated !== css) {
  fs.writeFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", updated, "utf-8");
  console.log("Updated");
} else {
  console.log("Pattern not found, checking content...");
  const idx = css.indexOf(".wiki-table td");
  console.log(css.substring(idx, idx+120));
}
