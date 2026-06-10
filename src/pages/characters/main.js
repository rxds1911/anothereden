import { createApp } from "vue"
    import AppSidebar from "../../components/AppSidebar.vue"
    import SearchBar from "../../components/SearchBar.vue"
    import DataTable from "../../components/DataTable.vue"
    import Breadcrumb from "../../components/Breadcrumb.vue"
    import { sampleCharacters } from "../../data/samples/characters.js"
    import "../../assets/styles/variables.css"
    import "../../assets/styles/reset.css"
    import "../../assets/styles/layout.css"
    import "../../assets/styles/sidebar.css"
    import "../../assets/styles/table.css"

    const columns = [{ label: '', key: 'name', sortable: false, type: 'avatar' }, { label: '名称', key: 'name', sortable: true }, { label: '头衔', key: 'form', sortable: true }, { label: '武器', key: 'weapon', sortable: true }, { label: '属性', key: 'element', sortable: true, tag: true }, { label: '天冥', key: 'lightShadow', sortable: true }]

    const app = createApp({
      data() {
        return { searchQuery: "", filterWeapon: [], filterElement: [], filterForm: [], filterPersonality: [], filterLightShadow: [], showPersonality: false, sortKey: "", sortDir: "", columns, filterOptions: [], personalityOptions: ["主人公","天之指引","冥之诱语","大地元晶","龙","恋爱烦恼","机械","诅咒","失忆","封印","葬仪","法外之人","复仇者"], weaponOptions: ['刀','剑','杖','斧','枪','弓','拳','锤'], elementOptions: ['火','水','风','地','无','阴','雷','晶'], formOptions: ['NS','AS','ES','AC'], lightShadowOptions: ['天','冥'], sidebarOpen: false }
      },
      computed: {
        allData() { return sampleCharacters },
        filteredData() {
          let list = this.allData
          if (this.filterWeapon.length) {
            list = list.filter(r => this.filterWeapon.includes(r.weapon))
          }
          if (this.filterElement.length) {
            list = list.filter(r => this.filterElement.includes(r.element))
          }
          if (this.filterForm.length) {
            list = list.filter(r => this.filterForm.includes(r.form))
          }
          if (this.filterPersonality.length) {
            list = list.filter(r => r.personality && r.personality.some(p => this.filterPersonality.includes(p)))
          }
          if (this.filterLightShadow.length) {
            list = list.filter(r => this.filterLightShadow.includes(r.lightShadow))
          }
          if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase()
            list = list.filter(r => Object.values(r).some(v => v.toString().toLowerCase().includes(q)))
          }
          return list
        }
      },
      methods: {
        toggleSidebar() { this.sidebarOpen = !this.sidebarOpen },
        toggleFilter(key, value) {
          const arr = this[key]
          if (arr.includes(value)) {
            this[key] = arr.filter(v => v !== value)
          } else {
            this[key] = [...arr, value]
          }
        },
        goToDetail(row) { window.location.href = "../character-detail/index.html?id=" + row.id }
      }
    })
    app.component("app-sidebar", AppSidebar)
    app.component("search-bar", SearchBar)
    app.component("data-table", DataTable)
    app.component("breadcrumb", Breadcrumb)
    app.mount("#app")

