const fs = require("fs");
let h = fs.readFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", "utf-8");

// Fix 星导技能 - remove 技能名, 属性, MP columns
h = h.replace(
  '<thead><tr><th>技能名</th><th>属性</th><th>MP</th><th>强化前</th><th>强化后</th></tr></thead>',
  '<thead><tr><th>强化前</th><th>强化后</th></tr></thead>'
);
h = h.replace(
  '<td><strong>{{ skill.name }}</strong></td>\n              <td><span :class="\'tag tag-\' + skill.type.toLowerCase()">{{ skill.type }}</span></td>\n              <td>{{ skill.cost }}</td>\n              <td class="skill-desc">{{ skill.normalState }}</td>\n              <td class="skill-desc">{{ skill.burstState }}</td>',
  '<td class="skill-desc">{{ skill.normalState }}</td>\n              <td class="skill-desc">{{ skill.burstState }}</td>'
);

fs.writeFileSync("C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html", h, "utf-8");
console.log("Done");
