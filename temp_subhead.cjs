const fs = require("fs");
const cssPath = "C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css";
let css = fs.readFileSync(cssPath, "utf-8");
// Make skill-sub-heading more prominent
css += `
.skill-sub-heading {
  margin: 12px 0 6px 0 !important;
  padding: 6px 10px !important;
  background: #eef2f7 !important;
  border-left: 3px solid #1a2940 !important;
  font-weight: 700 !important;
  font-size: .88rem !important;
  color: #1a2940 !important;
}
`;
fs.writeFileSync(cssPath, css, "utf-8");
console.log("Updated skill-sub-heading");
