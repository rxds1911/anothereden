const fs = require("fs");
const css = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", "utf-8");
// Change margin to remove left margin
css = css.replace(
  "margin: 16px 20px 8px;",
  "margin: 16px 0 8px 0;"
);
// Also remove padding-left from wiki-section
css = css.replace(
  "padding: 10px 20px;",
  "padding: 10px 0 10px 0;"
);
// Actually no, let me not change section header. Just the skill-type headings.
// Also remove left padding from wiki-table first cell
css += `
.skill-type-heading {
  padding-left: 0;
}
.wiki-table th:first-child,
.wiki-table td:first-child {
  padding-left: 4px;
}
`;
fs.writeFileSync("C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css", css, "utf-8");
console.log("Fixed");
