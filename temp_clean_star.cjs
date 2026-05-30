const fs = require("fs");
let h = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", "utf-8");

// Fix 天冥能力 - remove 能力名 and 条件 columns
h = h.replace(
  '<thead><tr><th>能力名</th><th>条件</th><th>初期效果</th><th>强化效果</th></tr></thead>',
  '<thead><tr><th>初期效果</th><th>强化效果</th></tr></thead>'
);
h = h.replace(
  '<td>{{ item.name }}</td><td>{{ item.condition }}</td><td class="skill-desc">{{ item.initialEffect }}</td><td class="skill-desc">{{ item.enhancedEffect }}</td>',
  '<td class="skill-desc">{{ item.initialEffect }}</td><td class="skill-desc">{{ item.enhancedEffect }}</td>'
);

// Fix 星导爆裂强化 - remove 名称 column
h = h.replace(
  '<thead><tr><th>名称</th><th>初期效果</th><th>强化效果</th></tr></thead>',
  '<thead><tr><th>初期效果</th><th>强化效果</th></tr></thead>'
);
h = h.replace(
  '<td>{{ item.name }}</td><td class="skill-desc">{{ item.initialEffect }}</td><td class="skill-desc">{{ item.enhancedEffect }}</td>',
  '<td class="skill-desc">{{ item.initialEffect }}</td><td class="skill-desc">{{ item.enhancedEffect }}</td>'
);

// Fix 获得能力 - remove 能力名 and 解锁条件 columns
h = h.replace(
  '<thead><tr><th>能力名</th><th>解锁条件</th><th>初期效果</th><th>强化效果</th></tr></thead>',
  '<thead><tr><th>初期效果</th><th>强化效果</th></tr></thead>'
);
h = h.replace(
  '<td>{{ item.name }}</td><td>{{ item.unlock }}</td><td class="skill-desc">{{ item.initialEffect }}</td><td class="skill-desc">{{ item.enhancedEffect }}</td>',
  '<td class="skill-desc">{{ item.initialEffect }}</td><td class="skill-desc">{{ item.enhancedEffect }}</td>'
);

fs.writeFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", h, "utf-8");
console.log("Done");
