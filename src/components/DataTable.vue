<template>
  <div class="char-list">
    <!-- Sort Bar -->
    <div class="char-list-toolbar" v-if="columns.some(c => c.sortable)">
      <span class="sort-label">排序</span>
      <span v-for="col in columns.filter(c => c.sortable)" :key="col.key"
        class="sort-btn" :class="{ active: sortKey === col.key, asc: sortKey === col.key && sortDir === 'asc', desc: sortKey === col.key && sortDir === 'desc' }"
        @click="toggleSort(col.key)">
        {{ col.label }}
        <span class="sort-arrow" v-if="sortKey === col.key">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
      </span>
      <span v-if="hasActiveFilters" class="sort-clear-all" @click="$emit('clear-filters')">
        清除筛选
      </span>
    </div>

    <!-- Empty State -->
    <div v-if="sortedData.length === 0" class="char-list-empty">
      <div class="char-list-empty-icon">🔍</div>
      <div class="char-list-empty-text">没有找到符合条件的角色</div>
      <div class="char-list-empty-hint">试试调整筛选条件或搜索关键词</div>
    </div>

    <!-- Cards (character mode) -->
    <div v-for="(row, i) in sortedData" :key="row.id || i" v-if="hasPersonality" class="char-card" @click="$emit('row-click', row)" :style="{ animationDelay: (i * 0.03) + 's' }">
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
    <!-- Card mode (generic data) -->
    <div v-if="!hasPersonality" class="char-list">
      <div v-for="(row, i) in sortedData" :key="row.id || i" class="char-card" :style="{ animationDelay: (i * 0.03) + 's' }">
        <div class="char-card-avatar" style="background: linear-gradient(135deg, #c8a84e, #e8c96e); font-size: 1.2rem;">#{{ row.id }}</div>
        <div class="char-card-body">
          <div class="char-card-top">
            <span class="char-card-name">{{ row.name }}</span>
          </div>
          <div class="generic-card-detail">
            <div class="generic-card-row" v-if="row.startCondition">
              <span class="generic-card-label">开始条件</span>
              <span class="generic-card-value">{{ row.startCondition }}</span>
            </div>
            <div class="generic-card-row" v-if="row.location">
              <span class="generic-card-label">出现地域</span>
              <span class="generic-card-value">{{ row.location }}</span>
            </div>
            <div class="generic-card-row" v-if="row.reward">
              <span class="generic-card-label">报酬</span>
              <span class="generic-card-value">{{ row.reward }}</span>
            </div>
          </div>
        </div>
        <div class="char-card-arrow">›</div>
      </div>
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
    sortDir: String,
    hasActiveFilters: { type: Boolean, default: false }
  },
  emits: ["update:sortKey", "update:sortDir", "row-click", "clear-filters"],
  computed: {
    hasPersonality() {
      return this.data.length > 0 && this.data[0].personality !== undefined
    },
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