import { createApp } from "vue"
    import AppSidebar from "../../components/AppSidebar.vue"
    import SearchBar from "../../components/SearchBar.vue"
    import DataTable from "../../components/DataTable.vue"
    import Breadcrumb from "../../components/Breadcrumb.vue"
    import { sampleCharacters } from "../../data/samples/characters.js"
    import { weaponTypes, elementOptions, formOptions, lightShadowOptions, personalityOptions } from "../../data/config.js"
    import { filterCharacters, hasActiveCharacterFilters } from "../../utils/characters-filter.js"
    import { resolveCharacterName, characterSearchText } from "../../utils/name-display.js"
    import "../../assets/styles/variables.css"
    import "../../assets/styles/reset.css"
    import "../../assets/styles/layout.css"
    import "../../assets/styles/sidebar.css"
    import "../../assets/styles/table.css"

    const columns = [{ label: '', key: 'name', sortable: false, type: 'avatar' }, { label: '名称', key: 'name', sortable: true }, { label: '头衔', key: 'form', sortable: true }, { label: '武器', key: 'weapon', sortable: true }, { label: '属性', key: 'element', sortable: true, tag: true }, { label: '天冥', key: 'lightShadow', sortable: true }]

    export const appOptions = {
      data() {
        return { searchQuery: "", filterWeapon: [], filterElement: [], filterForm: [], filterPersonality: [], filterLightShadow: [], showPersonality: false, sortKey: "", sortDir: "", columns, filterOptions: [], personalityOptions, weaponTypes, elementOptions, formOptions, lightShadowOptions, sidebarOpen: window.innerWidth > 768 }
      },
      computed: {
        // 按全局名称显示模式（国际服译名 / 国服译名 / 日文名）从术语表取名
        displayData() {
          return sampleCharacters.map((c) => ({ ...c, name: resolveCharacterName(c), nameVariants: characterSearchText(c) }))
        },
        allData() { return this.displayData },
        hasActiveFilters() {
          return hasActiveCharacterFilters({
            weapon: this.filterWeapon,
            element: this.filterElement,
            form: this.filterForm,
            personality: this.filterPersonality,
            lightShadow: this.filterLightShadow,
            query: this.searchQuery
          })
        },
        filteredData() {
          return filterCharacters(this.displayData, {
            weapon: this.filterWeapon,
            element: this.filterElement,
            form: this.filterForm,
            personality: this.filterPersonality,
            lightShadow: this.filterLightShadow,
            query: this.searchQuery
          })
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
        clearFilters() {
          this.filterWeapon = []
          this.filterElement = []
          this.filterForm = []
          this.filterLightShadow = []
          this.filterPersonality = []
          this.searchQuery = ""
        },
        goToDetail(row) { window.location.href = "../character-detail/index.html?id=" + row.id }
      }
    }
    const app = createApp(appOptions)
    app.component("app-sidebar", AppSidebar)
    app.component("search-bar", SearchBar)
    app.component("data-table", DataTable)
    app.component("breadcrumb", Breadcrumb)
    if (document.getElementById("app")) {
      app.mount("#app")
    }
