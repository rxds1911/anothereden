const fs = require("fs");
const h = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", "utf-8");
// Find where the star guide section actually starts
const starIdx = h.indexOf("星导觉醒");
const notFoundIdx = h.indexOf("角色未找到");
const secondAppIdx = h.indexOf('<div id="app">', 500);
const firstMainEnd = h.indexOf("</main>");
const secondMainEnd = h.indexOf("</main>", firstMainEnd + 1);
console.log("Star guide at:", starIdx);
console.log("Not found at:", notFoundIdx);
console.log("Second app at:", secondAppIdx);
console.log("First </main> at:", firstMainEnd);
console.log("Second </main> at:", secondMainEnd);
console.log("Script tag at:", h.indexOf("<script", h.length - 200));
