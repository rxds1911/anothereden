const fs = require("fs");
const cssPath = "C:/Users/xylt2/Documents/anothereden/src/assets/styles/detail.css";
let css = fs.readFileSync(cssPath, "utf-8");
if (!css.includes("skill-group-label")) {
    css += "\n\n.skill-group-label {\n  background: #f0f4f8 !important;\n  font-weight: 700;\n  color: #2a3f5a;\n  font-size: .85rem;\n  text-align: center;\n  border-bottom: 2px solid #c8a84e;\n}\n";
    fs.writeFileSync(cssPath, css, "utf-8");
    console.log("Added skill-group-label CSS");
} else {
    console.log("Already exists");
}
