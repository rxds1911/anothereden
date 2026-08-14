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
      <div class="char-list-empty-text">{{ emptyText }}</div>
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
      <div v-for="(row, i) in sortedData" :key="row.id || i" class="char-card" @click="$emit('row-click', row)" :style="{ animationDelay: (i * 0.03) + 's' }">
        <div v-if="showAvatar" class="char-card-avatar" :style="{ background: row.isHiddenBoss ? 'linear-gradient(135deg, #c0392b, #e74c3c)' : 'linear-gradient(135deg, #c8a84e, #e8c96e)', fontSize: '1.2rem' }">{{ row.icon || (showId ? '#' + row.id : ((row[avatarKey] || '?')[0])) }}</div>
        <img v-if="row.image" class="generic-card-image" :src="row.image" :alt="row.name" />
        <div class="char-card-body">
          <div class="char-card-top">
            <span class="char-card-name">{{ showId ? '#' + row.id + ' ' + row.name : row.name }}</span>
            <span v-if="row.difficulty" class="difficulty-badge" :class="'difficulty-badge--' + row.difficulty">{{ row.difficulty }}</span>
            <span v-if="row.character && row.name" class="task-category-badge">{{ row.character }}</span>
            <span v-if="row.isHiddenBoss" class="hidden-boss-badge">隐王</span>
            <span v-if="row.taskCategory" class="task-category-badge">{{ row.taskCategory }}</span>
          </div>
          <div class="generic-card-detail" :class="{ 'two-col': twoColumnDetail }">
            <template v-for="col in detailColumns(row)" :key="col.key">
              <div class="generic-card-row" :class="{ 'generic-card-row--full': col.full }" v-if="col.value !== undefined && col.value !== null && col.value !== ''">
                <span class="generic-card-label">{{ col.label }}</span>
                <span class="generic-card-value">{{ col.value }}</span>
              </div>
            </template>
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
    hasActiveFilters: { type: Boolean, default: false },
    emptyText: { type: String, default: "没有找到符合条件的战斗" },
    showId: { type: Boolean, default: true },
    showAvatar: { type: Boolean, default: true },
    avatarKey: { type: String, default: "name" },
    twoColumnDetail: { type: Boolean, default: false }
  },
  emits: ["update:sortKey", "update:sortDir", "row-click", "clear-filters"],
  computed: {
    hasPersonality() {
      return this.data.length > 0 && Array.isArray(this.data[0].personality)
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
    detailColumns(row) {
      const cols = this.columns
        .filter(c => c.key !== "name" && c.key !== "id")
        .map(c => ({ key: c.key, label: c.label, value: c.format ? c.format(row[c.key], row) : row[c.key] }))
        .filter(d => d.value !== undefined && d.value !== null && d.value !== '')
      if (this.twoColumnDetail && cols.length % 2 === 1) {
        cols[cols.length - 1].full = true
      }
      return cols
    },
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


