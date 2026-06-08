<template>
  <div class="data-table-wrapper">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key"
            :class="{ sortable: col.sortable, ['sort-' + sortDir]: sortKey === col.key }"
            @click="col.sortable && toggleSort(col.key)">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="sortedData.length === 0">
          <td :colspan="columns.length" style="text-align:center;padding:40px;color:var(--color-text-light)">
            暂无数据
          </td>
        </tr>
        <tr v-for="(row, i) in sortedData" :key="i" @click="$emit('row-click', row)" style="cursor:pointer">
          <td v-for="col in columns" :key="col.key">
            <span v-if="col.type === 'avatar'" class="table-avatar">{{ (row[col.key] || '?')[0] }}</span>
            <span v-else-if="col.tag" :class="'tag tag-' + (row[col.key] || '').toLowerCase()">{{ row[col.key] }}</span>
            <span v-else-if="col.type === 'list'">{{ (row[col.key] || []).join('、') }}</span>
            <span v-else>{{ row[col.key] || '-' }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "DataTable",
  props: {
    columns: Array,
    data: { type: Array, default: () => [] },
    sortKey: String,
    sortDir: String
  },
  emits: ["update:sortKey", "update:sortDir", "row-click"],
  computed: {
    sortedData() {
      if (!this.sortKey) return this.data
      const arr = [...this.data]
      arr.sort((a, b) => {
        const va = (a[this.sortKey] || "").toString()
        const vb = (b[this.sortKey] || "").toString()
        return this.sortDir === "asc" ? va.localeCompare(vb, "zh-CN") : vb.localeCompare(va, "zh-CN")
      })
      return arr
    }
  },
  methods: {
    toggleSort(key) {
      if (this.sortKey === key) {
        const next = this.sortDir === "asc" ? "desc" : this.sortDir === "desc" ? "" : "asc"
        this.$emit("update:sortDir", next)
        if (!next) this.$emit("update:sortKey", "")
      } else {
        this.$emit("update:sortKey", key)
        this.$emit("update:sortDir", "asc")
      }
    }
  }
}
</script>
