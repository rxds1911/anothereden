import { createApp } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
import { sampleCharacters } from '../../data/samples/characters.js'
import '../../assets/styles/variables.css'
import '../../assets/styles/reset.css'
import '../../assets/styles/layout.css'
import '../../assets/styles/sidebar.css'
import '../../assets/styles/table.css'
import '../../assets/styles/detail.css'

const params = new URLSearchParams(window.location.search)
const charId = params.get('id')
const character = sampleCharacters.find(c => c.id === charId) || null

const app = createApp({
  data() {
    return {
      character,
      sidebarOpen: false,
      skillTypes: ['战斗宣言', '固有技能', '习得技能']
    }
  },
  computed: {
    hasStarGuide() {
      return this.character && this.character.starGuideAbilities && this.character.starGuideAbilities.abilityGain
    },
    starSkills() {
      if (!this.character || !this.character.starGuideAbilities || !this.character.starGuideAbilities.starSkills) return []
      return this.character.starGuideAbilities.starSkills
    },
    mergedStarAbilities() {
      if (!this.hasStarGuide) return []
      const list = []
      const sa = this.character.starGuideAbilities
      for (const item of sa.tenmei || []) { list.push({ ...item, category: '天冥能力', cond: item.condition || '' }) }
      for (const item of sa.burstEnhance || []) { list.push({ ...item, category: '星导爆裂强化', cond: item.condition || '' }) }
      for (const item of sa.abilityGain || []) { list.push({ ...item, category: '获得能力', cond: item.unlock || '' }) }
      return list
    }
  },
  methods: {
    toggleSidebar() { this.sidebarOpen = !this.sidebarOpen },
    getSkillsByType(type) {
      if (!this.character || !this.character.skills) return []
      return this.character.skills.filter(s => s.skillType === type)
    },
    getTypeColor(type) {
      const colors = { '火': '#e74c3c', '水': '#3498db', '风': '#2ecc71', '地': '#8e44ad', '雷': '#f39c12', '阴': '#6c5ce7', '晶': '#00cec9', '无': '#95a5a6' }
      return colors[type] || '#888'
    }
  }
})
app.component('app-sidebar', AppSidebar)
app.mount('#app')
