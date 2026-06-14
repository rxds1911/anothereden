<template>
  <div class="char-list">
    <div class="char-list-toolbar" v-if="columns.some(c => c.sortable)">
      <span class="sort-label">排序：</span>
      <span v-for="col in columns.filter(c => c.sortable)" :key="col.key"
        class="sort-btn" :class="{ active: sortKey === col.key, asc: sortKey === col.key && sortDir === 'asc', desc: sortKey === col.key && sortDir === 'desc' }"
        @click="toggleSort(col.key)">
        {{ col.label }}
        <span class="sort-arrow" v-if="sortKey === col.key">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
      </span>
    </div>
    <div v-if="sortedData.length === 0" class="char-list-empty">
      暂无数据
    </div>
    <div v-for="(row, i) in sortedData" :key="i" class="char-card" @click="$emit('row-click', row)">
      <div class="char-card-avatar">{{ (row.name || '?')[0] }}</div>
      <div class="char-card-body">
        <div class="char-card-top">
          <span class="char-card-name">{{ row.name }}</span>
          <span class="char-card-form">{{ row.form || '-' }}</span>
        </div>
        <div class="char-card-tags">
          <span class="char-card-tag" :class="'tag-' + (row.element || '').toLowerCase()">{{ row.element }}</span>
          <span class="char-card-tag tag-weapon">{{ row.weapon }}</span>
          <span class="char-card-tag tag-ls">{{ row.lightShadow }}</span>
        </div>
        <div class="char-card-personality" v-if="row.personality && row.personality.length">
          <span v-for="p in row.personality.slice(0, 4)" :key="p" class="char-card-pers">{{ p }}</span>
          <span v-if="row.personality.length > 4" class="char-card-pers-more">+{{ row.personality.length - 4 }}</span>
        </div>
      </div>
      <div class="char-card-arrow">›</div>
    </div>
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