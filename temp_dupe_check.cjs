const fs = require("fs");
const h = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", "utf-8");
console.log("Count of 基础属性:", (h.match(/基础属性/g) || []).length);
console.log("Count of 天冥奖励:", (h.match(/天冥奖励/g) || []).length);
console.log("Count of skills:", (h.match(/技能[\s\S]{0,10}<.div>/g) || []).length);
console.log("File size:", h.length);
let sections = [];
let idx = 0;
while ((idx = h.indexOf('<div class="wiki-section">', idx)) >= 0) {
    sections.push(idx);
    idx++;
}
console.log("Section positions:", JSON.stringify(sections));
