const fs = require("fs");
const path = "C:/Users/xylt2/Documents/anothereden/src/pages/character-detail/index.html";

const correctHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>角色详情</title>
</head>
<body>
  <div id="app">
    <button class="sidebar-toggle" @click="toggleSidebar"></button>
    <div class="sidebar-overlay" :class="{ show: sidebarOpen }" @click="toggleSidebar"></div>
    <aside class="sidebar" :class="{ open: sidebarOpen }">
      <app-sidebar current-page="characters"></app-sidebar>
    </aside>
    <main class="main-content" v-if="character">
      <a class="back-link" href="../characters/index.html"> 返回角色列表</a>

      <div class="char-header">
        <div class="char-avatar">⭐</div>
        <div class="char-header-info">
          <h1 class="char-name">{{ character.name }}</h1>
          <div class="char-title-row">
            <span class="char-class-tag">{{ character.job }}</span>
            <span class="char-rank-tag">{{ character.stars }}★</span>
            <span :class="'char-element-tag tag-' + character.element.toLowerCase()">{{ character.element }}</span>
          </div>
          <div class="char-personality">
            <span v-for="p in character.personality" :key="p" class="personality-badge">{{ p }}</span>
          </div>
        </div>
      </div>

      <div class="wiki-section">
        <div class="wiki-section-header">基础属性</div>
        <div class="stats-grid">
          <div class="stat-item"><div class="stat-label">星级</div><div class="stat-value">{{ character.stars }} ★</div></div>
          <div class="stat-item"><div class="stat-label">头衔</div><div class="stat-value">{{ character.title }}</div></div>
          <div class="stat-item"><div class="stat-label">天冥</div><div class="stat-value">{{ character.lightShadow }}</div></div>
          <div class="stat-item"><div class="stat-label">性别</div><div class="stat-value">{{ character.gender }}</div></div>
          <div class="stat-item"><div class="stat-label">星导</div><div class="stat-value">{{ character.starGuide }}</div></div>
          <div class="stat-item"><div class="stat-label">属性</div><div class="stat-value"><span :class="'tag tag-' + character.element.toLowerCase()">{{ character.element }}</span></div></div>
          <div class="stat-item"><div class="stat-label">武器</div><div class="stat-value">{{ character.weapon }}</div></div>
          <div class="stat-item"><div class="stat-label">职业书掉落</div><div class="stat-value">{{ character.tomeDrop }}</div></div>
          <div class="stat-item"><div class="stat-label">声优</div><div class="stat-value">{{ character.voiceActor }}</div></div>
          <div class="stat-item"><div class="stat-label">入手方式</div><div class="stat-value">{{ character.acquisition }}</div></div>
        </div>
      </div>

      <div class="wiki-section">
        <div class="wiki-section-header">天冥奖励</div>
        <div class="tenmei-grid">
          <div class="tenmei-card" v-for="item in character.starGuideAbilities.tenmei" :key="item.condition">
            <div class="tenmei-level">{{ item.condition }}</div>
            <div class="tenmei-effect">{{ item.initialEffect }}</div>
          </div>
        </div>
      </div>

      <div class="wiki-section">
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
              <template v-for="skill in getSkillsByType(st)" :key="skill.name">
                <tr v-if="st === '\u6218\u6597\u5ba3\u8a00'">
                  <td><strong>{{ skill.name }}</strong></td>
                  <td>{{ skill.level || 'Lv.1' }}</td>
                </tr>
                <tr v-else>
                  <td><strong>{{ skill.name }}</strong></td>
                  <td><span :class="'tag tag-' + skill.type.toLowerCase()">{{ skill.type }}</span></td>
                  <td>{{ skill.cost }}</td>
                  <td class="skill-desc">{{ skill.desc }}</td>
                </tr>
              </template>
            </tbody>
          </table>
          <p v-else class="no-data">暂无</p>
        </div>
      </div>

      <div class="wiki-section" v-if="hasStarGuide">
        <div class="wiki-section-header">星导觉醒</div>
        <h4 class="skill-type-heading">星导技能</h4>
        <table class="wiki-table" v-if="starSkills.length">
          <thead><tr><th>技能名</th><th>属性</th><th>MP</th><th>强化前</th><th>强化后</th></tr></thead>
          <tbody>
            <tr v-for="skill in starSkills" :key="skill.name">
              <td><strong>{{ skill.name }}</strong></td>
              <td><span :class="'tag tag-' + skill.type.toLowerCase()">{{ skill.type }}</span></td>
              <td>{{ skill.cost }}</td>
              <td class="skill-desc">{{ skill.normalState }}</td>
              <td class="skill-desc">{{ skill.burstState }}</td>
            </tr>
          </tbody>
        </table>
        <h4 class="skill-type-heading">觉醒能力</h4>
        <h4 class="skill-sub-heading">天冥能力</h4>
        <table class="wiki-table" v-if="character.starGuideAbilities.tenmei.length">
          <thead><tr><th>能力名</th><th>条件</th><th colspan="2">效果</th></tr><tr><th></th><th></th><th>初期效果</th><th>强化效果</th></tr></thead>
          <tbody>
            <tr v-for="item in character.starGuideAbilities.tenmei" :key="item.condition">
              <td>{{ item.name }}</td><td>{{ item.condition }}</td><td class="skill-desc">{{ item.initialEffect }}</td><td class="skill-desc">{{ item.enhancedEffect }}</td>
            </tr>
          </tbody>
        </table>
        <h4 class="skill-sub-heading">星导爆裂强化</h4>
        <table class="wiki-table" v-if="burstEnhance.length">
          <thead><tr><th>名称</th><th colspan="2">效果</th></tr><tr><th></th><th>初期效果</th><th>强化效果</th></tr></thead>
          <tbody>
            <tr v-for="item in burstEnhance" :key="item.name">
              <td>{{ item.name }}</td><td class="skill-desc">{{ item.initialEffect }}</td><td class="skill-desc">{{ item.enhancedEffect }}</td>
            </tr>
          </tbody>
        </table>
        <h4 class="skill-sub-heading">获得能力</h4>
        <table class="wiki-table" v-if="abilityGain.length">
          <thead><tr><th>能力名</th><th>解锁条件</th><th colspan="2">效果</th></tr><tr><th></th><th></th><th>初期效果</th><th>强化效果</th></tr></thead>
          <tbody>
            <tr v-for="item in abilityGain" :key="item.name">
              <td>{{ item.name }}</td><td>{{ item.unlock }}</td><td class="skill-desc">{{ item.initialEffect }}</td><td class="skill-desc">{{ item.enhancedEffect }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
    <main class="main-content" v-else>
      <div class="page-header">
        <h1>角色未找到</h1>
        <p><a href="../characters/index.html">返回角色列表</a></p>
      </div>
    </main>
  </div>
  <script type="module" src="main.js"></script>
</body>
</html>`;

fs.writeFileSync(path, correctHtml, "utf-8");
console.log("Written. Size:", correctHtml.length);
