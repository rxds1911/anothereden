import { createApp } from 'vue'
import AppSidebar from '/src/components/AppSidebar.vue'
import { navItems } from '/src/data/nav.js'
import '/src/assets/styles/variables.css'
import '/src/assets/styles/reset.css'
import '/src/assets/styles/layout.css'
import '/src/assets/styles/sidebar.css'
import '/src/assets/styles/cards.css'

const app = createApp({
  data() {
    return {
      navItems,
      sidebarOpen: false,
      itemCounts: {
        '角色': 5, '战斗': 3, '武器': 5, '防具': 4, '徽章': 4,
        '地图': 4, '灵晶': 5, '书架': 4, '猫': 4, '日记': 4,
        '专武': 4, '回生': 3, '副本': 4, '活动': 4
      }
    }
  },
  methods: {
    toggleSidebar() { this.sidebarOpen = !this.sidebarOpen },
    getItemCount(name) { return this.itemCounts[name] || '' }
  }
})
app.component('app-sidebar', AppSidebar)
app.mount('#app')
