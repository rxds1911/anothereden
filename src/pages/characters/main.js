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

    const columns = [{ label: '名称', key: 'name', sortable: true }, { label: '属性', key: 'element', sortable: true, tag: true }, { label: '武器', key: 'weapon', sortable: true }, { label: '星级', key: 'stars', sortable: true }, { label: '头衔', key: 'title', sortable: true }, { label: '天冥', key: 'lightShadow', sortable: true }]

    const app = createApp({
      data() {
        return { searchQuery: "", filterValue: "", sortKey: "", sortDir: "", columns, filterOptions: [], sidebarOpen: false }
      },
      computed: {
        allData() { return sampleCharacters },
        filteredData() {
          let list = this.allData
          if (this.filterValue) {
            list = list.filter(r => r.element === this.filterValue || r.type === this.filterValue)
          }
          if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase()
            list = list.filter(r => Object.values(r).some(v => v.toString().toLowerCase().includes(q)))
          }
          return list
        }
      },
      methods: {
        toggleSidebar() { this.sidebarOpen = !this.sidebarOpen }, goToDetail(row) { window.location.href = "../character-detail/index.html?id=" + row.id }
      }
    })
    app.component("app-sidebar", AppSidebar)
    app.component("search-bar", SearchBar)
    app.component("data-table", DataTable)
    app.component("breadcrumb", Breadcrumb)
    app.mount("#app")

