const fs = require("fs");
let h = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", "utf-8");

h = h.replace(
  '<thead><tr><th>能力名</th><th>条件</th><th colspan="2">效果</th></tr><tr><th></th><th></th><th>初期效果</th><th>强化效果</th></tr></thead>',
  '<thead><tr><th>能力名</th><th>条件</th><th>初期效果</th><th>强化效果</th></tr></thead>'
);

h = h.replace(
  '<thead><tr><th>名称</th><th colspan="2">效果</th></tr><tr><th></th><th>初期效果</th><th>强化效果</th></tr></thead>',
  '<thead><tr><th>名称</th><th>初期效果</th><th>强化效果</th></tr></thead>'
);

h = h.replace(
  '<thead><tr><th>能力名</th><th>解锁条件</th><th colspan="2">效果</th></tr><tr><th></th><th></th><th>初期效果</th><th>强化效果</th></tr></thead>',
  '<thead><tr><th>能力名</th><th>解锁条件</th><th>初期效果</th><th>强化效果</th></tr></thead>'
);

fs.writeFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", h, "utf-8");
console.log("Fixed");
