const fs = require("fs");
const css = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", "utf-8");
const lines = css.split("\n");
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("skill-type-heading")) {
        console.log(i, ":", lines[i]);
        for (let j = i; j < Math.min(i+8, lines.length); j++) {
            if (lines[j].includes("}")) { console.log(j, ":", lines[j]); break; }
            console.log(j, ":", lines[j]);
        }
    }
}
