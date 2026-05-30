const fs = require("fs");
const h = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", "utf-8");
console.log("Count of 基础属性:", (h.match(/基础属性/g) || []).length);
console.log("Count of 天冥奖励:", (h.match(/天冥奖励/g) || []).length);
console.log("Count of wiki-section:", (h.match(/wiki-section">/g) || []).length);
console.log("Has v-if st:", h.includes('v-if="st =='));
console.log("File size:", h.length);
