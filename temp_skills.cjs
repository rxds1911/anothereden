const fs = require("fs");
const path = "C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html";

let h = fs.readFileSync(path, "utf-8");

// Find and replace the skills section
const skillsStart = h.indexOf('<div class="wiki-section">\n        <div class="wiki-section-header">技能</div>');
const nextSection = h.indexOf('<div class="wiki-section"', skillsStart + 5);
const sectionEnd = h.indexOf("</div>", h.indexOf("</div>", h.indexOf("</div>", skillsStart + 200) + 10) + 10);

// Just find the exact section by looking for the closing </div> pattern after the section
let depth = 0;
let inTag = false;
let sectionEndIdx = -1;
for (let i = skillsStart; i < h.length; i++) {
    if (h[i] === "<") { inTag = true; }
    else if (h[i] === ">") { inTag = false; }
    if (!inTag && h.substring(i, i+6) === "<div ") { depth++; }
    else if (!inTag && h.substring(i, i+6) === "</div>") {
        depth--;
        if (depth === 0) { sectionEndIdx = i + 6; break; }
    }
}

console.log("skillsStart:", skillsStart, "sectionEndIdx:", sectionEndIdx);
const oldSection = h.substring(skillsStart, sectionEndIdx);

const newSection = `<div class="wiki-section">
        <div class="wiki-section-header">技能</div>
        <div v-if="getSkillsByType(skillTypes[0]).length || getSkillsByType(skillTypes[1]).length || getSkillsByType(skillTypes[2]).length">
          <table class="wiki-table">
            <thead>
              <tr>
                <th rowspan="2">技能名</th>
                <th>\u6218\u6597\u5ba3\u8a00</th>
                <th colspan="3">\u56fa\u6709\u6280\u80fd\u3001\u4e60\u5f97\u6280\u80fd</th>
              </tr>
              <tr>
                <th>\u7b49\u7ea7</th>
                <th>\u5c5e\u6027</th>
                <th>MP</th>
                <th>\u6548\u679c</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="st in skillTypes" :key="st">
                <tr v-if="getSkillsByType(st).length">
                  <td colspan="5" class="skill-group-label">{{ st }}</td>
                </tr>
                <tr v-for="skill in getSkillsByType(st)" :key="skill.name">
                  <td><strong>{{ skill.name }}</strong></td>
                  <td v-if="st === '\u6218\u6597\u5ba3\u8a00'">{{ skill.level || 'Lv.1' }}</td>
                  <td v-if="st === '\u6218\u6597\u5ba3\u8a00'" colspan="3"></td>
                  <td v-if="st !== '\u6218\u6597\u5ba3\u8a00'"></td>
                  <td v-if="st !== '\u6218\u6597\u5ba3\u8a00'"><span :class="'tag tag-' + skill.type.toLowerCase()">{{ skill.type }}</span></td>
                  <td v-if="st !== '\u6218\u6597\u5ba3\u8a00'">{{ skill.cost }}</td>
                  <td v-if="st !== '\u6218\u6597\u5ba3\u8a00'" class="skill-desc">{{ skill.desc }}</td>
                </tr>
              </template>
            </tbody>
          </table>
          <p v-else class="no-data">暂无</p>
        </div>
      </div>`;

h = h.substring(0, skillsStart) + newSection + h.substring(sectionEndIdx);
fs.writeFileSync(path, h, "utf-8");
console.log("Done. Size:", h.length);
