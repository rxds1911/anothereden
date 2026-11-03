import { createApp } from "vue"
import AppSidebar from "../../components/AppSidebar.vue"
import SearchBar from "../../components/SearchBar.vue"
import DataTable from "../../components/DataTable.vue"
import { loadDiaryEntries } from "../../services/diary-content.js"
import { mapAreas, storyEras } from "../../data/config.js"
import { filterRows } from "../../utils/filter.js"
import "../../assets/styles/variables.css"
import "../../assets/styles/reset.css"
import "../../assets/styles/layout.css"
import "../../assets/styles/sidebar.css"
import "../../assets/styles/table.css"

const columns = [
  { label: "猫咪叙述", key: "name", sortable: false },
  { label: "地点", key: "location", sortable: false },
  { label: "区域", key: "area", sortable: false },
  { label: "时代", key: "era", sortable: false }
]

export function createDiaryAppOptions({ loader = loadDiaryEntries } = {}) {
  return {
    data() {
      return {
        diaryEntries: [],
        loading: true,
        loadState: "loading",
        abortController: null,
        searchQuery: "",
        filterValue: "",
        filterEra: "",
        filterArea: "",
        columns,
        filterOptions: [],
        mapAreas,
        storyEras,
        sidebarOpen: window.innerWidth > 768
      }
    },
    computed: {
      filteredData() {
        return filterRows(this.diaryEntries, {
          filters: [
            { field: "era", values: this.filterEra ? [this.filterEra] : [] },
            { field: "area", values: this.filterArea ? [this.filterArea] : [] }
          ],
          searchFields: ["name", "location", "area", "era"],
          query: this.searchQuery
        })
      }
    },
    methods: {
      toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen
      },
      async loadEntries() {
        this.abortController = new AbortController()
        try {
          const result = await loader({ signal: this.abortController.signal })
          this.diaryEntries = result.entries
          this.loadState = result.source
        } catch (error) {
          if (!error || error.name !== "AbortError") throw error
        } finally {
          this.loading = false
        }
      }
    },
    mounted() {
      this.loadEntries()
    },
    beforeUnmount() {
      if (this.abortController) this.abortController.abort()
    }
  }
}

if (document.getElementById("app")) {
  const app = createApp(createDiaryAppOptions())
  app.component("app-sidebar", AppSidebar)
  app.component("search-bar", SearchBar)
  app.component("data-table", DataTable)
  app.mount("#app")
}
