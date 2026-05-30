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
      skillTypes: ['\u6218\u6597\u5ba3\u8a00', '\u56fa\u6709\u6280\u80fd', '\u4e60\u5f97\u6280\u80fd']
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
    burstEnhance() {
      if (!this.character || !this.character.starGuideAbilities || !this.character.starGuideAbilities.burstEnhance) return []
      return this.character.starGuideAbilities.burstEnhance
    },
    abilityGain() {
      if (!this.character || !this.character.starGuideAbilities || !this.character.starGuideAbilities.abilityGain) return []
      return this.character.starGuideAbilities.abilityGain
    }
  },
  methods: {
    toggleSidebar() { this.sidebarOpen = !this.sidebarOpen },
    getSkillsByType(type) {
      if (!this.character || !this.character.skills) return []
      return this.character.skills.filter(s => s.skillType === type)
    }
  }
})
app.component('app-sidebar', AppSidebar)
app.mount('#app')
