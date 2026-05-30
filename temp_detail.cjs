const fs = require("fs");
const h = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", "utf-8");
// Show more detailed structure
let positions = [];
let idx = 0;
const patterns = ["<div id=\"app\">", "char-header", "wiki-section", "star guide", "v-if=\"hasStarGuide\"", "</main>", "<!DOCTYPE", "v-else"];
let searchIdx = 0;
while (searchIdx < h.length) {
    let found = false;
    for (const p of patterns) {
        const pi = h.indexOf(p, searchIdx);
        if (pi >= 0 && pi < searchIdx + 20) {
            const snippet = h.substring(pi, Math.min(pi + 70, h.length)).replace(/\n/g, " ");
            console.log(pi, ":", snippet);
            searchIdx = pi + 1;
            found = true;
            break;
        }
    }
    if (!found) searchIdx++;
}
