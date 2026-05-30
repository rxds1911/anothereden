const fs = require("fs");
const css = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", "utf-8");
const lines = css.split("\n");
// Fix line 355: change th:first-child, to th:first-child:empty,
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("th:first-child,") && !lines[i].includes(":empty")) {
        lines[i] = lines[i].replace("th:first-child,", "th:first-child:empty,");
        console.log("Fixed line", i, ":", lines[i].trim());
    }
}
fs.writeFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", lines.join("\n"), "utf-8");
console.log("Done");
