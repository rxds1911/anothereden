import { createApp } from 'vue'
import AppSidebar from '../../components/AppSidebar.vue'
import { sampleCharacters } from '../../data/samples/characters.js'
import { resolveCharacterName } from '../../utils/name-display.js'
import { buildAwakenRows } from '../../utils/awaken-rows.js'
import '../../assets/styles/variables.css'
import '../../assets/styles/reset.css'
import '../../assets/styles/layout.css'
import '../../assets/styles/sidebar.css'
import '../../assets/styles/table.css'
import '../../assets/styles/detail.css'

const params = new URLSearchParams(window.location.search)
const charId = params.get('id')
const character = sampleCharacters.find(c => c.id === charId) || null

export const appOptions = {
  data() {
    return {
      character,
        sidebarOpen: window.innerWidth > 768,
      skillTypes: ['战斗宣言', '固有技能', '习得技能'],
      artLevel: 'fiveStar',
      artZoomed: false
    }
  },
  computed: {
    // 名称按全局显示模式从术语表取名，找不到时沿用数据里的名称
    displayName() {
      return resolveCharacterName(this.character)
    },
    // 立绘：术语表无关，取自角色数据的 art 字段（五星 / 四星）
    artOptions() {
      const art = this.character && this.character.art
      if (!art) return []
      const options = []
      if (art.fiveStar) options.push({ key: 'fiveStar', label: '五星立绘', src: art.fiveStar })
      if (art.fourStar) options.push({ key: 'fourStar', label: '四星立绘', src: art.fourStar })
      return options
    },
    activeArt() {
      return this.artOptions.find(o => o.key === this.artLevel) || this.artOptions[0] || null
    },
    activeArtKey() {
      return this.activeArt ? this.activeArt.key : ''
    },
    currentArt() {
      return this.activeArt ? this.activeArt.src : ''
    },
    // 天冥奖励（天冥值解锁的数值奖励，与觉醒能力表格无关）
    tenmeiRewards() {
      return (this.starGuideAbilities && this.starGuideAbilities.tenmei) || []
    },
    // 星导觉醒数据：天冥奖励（tenmei）、觉醒能力（awaken）、星导技能（starSkills）
    starGuideAbilities() {
      return (this.character && this.character.starGuideAbilities) || null
    },
    hasStarGuide() {
      const starGuide = this.starGuideAbilities
      if (!starGuide) return false
      return Boolean(
        (starGuide.starSkills && starGuide.starSkills.length) ||
        (starGuide.awaken && starGuide.awaken.length)
      )
    },
    starSkills() {
      return (this.starGuideAbilities && this.starGuideAbilities.starSkills) || []
    },
    // 觉醒能力：固定三个分类，每个分类占「初期效果 / 强化效果」两行
    awakenAbilities() {
      return (this.starGuideAbilities && this.starGuideAbilities.awaken) || []
    },
    awakenRows() {
      return buildAwakenRows(this.awakenAbilities)
    }
  },
  methods: {
    toggleSidebar() { this.sidebarOpen = !this.sidebarOpen },
    getSkillsByType(type) {
      if (!this.character || !this.character.skills) return []
      return this.character.skills.filter(s => s.skillType === type)
    },
    // 技能属性色统一走 CSS：table.css 的 .tag-*（颜色变量见 variables.css）
    getTypeClass(type) {
      return type ? 'tag-' + type : 'skill-card-icon--unknown'
    }
  }
}
const app = createApp(appOptions)
app.component('app-sidebar', AppSidebar)
if (document.getElementById('app')) {
  app.mount('#app')
}
