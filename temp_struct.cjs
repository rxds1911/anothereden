const fs = require("fs");
const h = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", "utf-8");
// Print the full file structure around sections
console.log("=== FILE STRUCTURE ===");
let positions = [];
let idx = 0;
while ((idx = h.indexOf("<div", idx)) >= 0) {
    const endIdx = h.indexOf(">", idx);
    const tag = h.substring(idx, Math.min(idx + 80, h.length)).replace(/\n/g, " ").trim();
    if (tag.includes("class=\"wiki-section\"") || tag.includes("class=\"main-content\"") || tag.includes("class=\"char-header\"") || tag.includes("class=\"sidebar\"") || tag.includes("id=\"app\"") || tag.includes("</main>")) {
        positions.push({pos: idx, tag: tag.substring(0, 70)});
    }
    idx = idx + 1;
}
positions.forEach((p, i) => console.log(i, p.pos, p.tag));
console.log("\n=== FILE SIZE ===", h.length);
console.log("=== STARTS WITH ===", h.substring(0, 100));
console.log("=== ENDS WITH ===", h.substring(h.length-50));
