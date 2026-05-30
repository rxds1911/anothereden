const fs = require("fs");
const path = "C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html";

const skillsHtml = `      <div class="wiki-section">
        <div class="wiki-section-header">技能</div>
        <div v-for="st in skillTypes" :key="st">
          <h4 class="skill-type-heading">{{ st }}</h4>
          <table class="wiki-table" v-if="getSkillsByType(st).length">
            <thead v-if="st === '\u6218\u6597\u5ba3\u8a00'">
              <tr><th>技能名</th><th>等级</th></tr>
            </thead>
            <thead v-else>
              <tr><th>技能名</th><th>属性</th><th>MP</th><th>效果</th></tr>
            </thead>
            <tbody>
              <tr v-for="skill in getSkillsByType(st)" :key="skill.name">
                <td v-if="st === '\u6218\u6597\u5ba3\u8a00'"><strong>{{ skill.name }}</strong></td>
                <td v-if="st === '\u6218\u6597\u5ba3\u8a00'">{{ skill.level || 'Lv.1' }}</td>
                <td v-if="st !== '\u6218\u6597\u5ba3\u8a00'"><strong>{{ skill.name }}</strong></td>
                <td v-if="st !== '\u6218\u6597\u5ba3\u8a00'"><span :class="'tag tag-' + skill.type.toLowerCase()">{{ skill.type }}</span></td>
                <td v-if="st !== '\u6218\u6597\u5ba3\u8a00'">{{ skill.cost }}</td>
                <td v-if="st !== '\u6218\u6597\u5ba3\u8a00'" class="skill-desc">{{ skill.desc }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="no-data">暂无</p>
        </div>
      </div>`;

// Find the skills section and replace it
let h = fs.readFileSync(path, "utf-8");
// Find from the wiki-section with 技能 header
const headerPos = h.indexOf('<div class="wiki-section-header">技能</div>');
// Find the enclosing wiki-section start
const secStart = h.lastIndexOf('<div class="wiki-section">', headerPos);
// Find the matching end
let depth = 1;
let i = secStart + 6;
let inTag = false;
while (i < h.length && depth > 0) {
    if (h[i] === "<") inTag = true;
    else if (h[i] === ">") inTag = false;
    if (!inTag && h.substring(i, i+6) === "<div ") { depth++; i += 5; }
    else if (!inTag && h.substring(i, i+6) === "</div>") { depth--; i += 5; }
    i++;
}
const secEnd = i;

const before = h.substring(0, secStart);
const after = h.substring(secEnd);

// Check for the star guide section
const starPos = h.indexOf("星导觉醒", secEnd);

const result = before + skillsHtml + after;

fs.writeFileSync(path, result, "utf-8");
console.log("Done. Size:", result.length);
console.log("Skills replaced from", secStart, "to", secEnd);
