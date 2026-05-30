<template>
  <div class="toolbar">
    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input type="text" :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="search-input" />
    </div>
    <select v-if="filters && filters.length" :value="filterValue"
      @change="$emit('update:filterValue', $event.target.value)"
      class="filter-select">
      <option value="">全部</option>
      <option v-for="f in filters" :key="f.value" :value="f.value">{{ f.label }}</option>
    </select>
  </div>
</template>

<script>
export default {
  name: "SearchBar",
  props: {
    modelValue: String,
    placeholder: { type: String, default: "搜索..." },
    filters: Array,
    filterValue: String
  },
  emits: ["update:modelValue", "update:filterValue"]
}
</script>

<style scoped>
.toolbar { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; }
.search-bar { display: flex; align-items: center; gap: 8px; background: var(--color-bg-card); border: 1px solid var(--color-border); border-radius: var(--border-radius); padding: 6px 12px; flex: 1; max-width: 500px; }
.search-icon { font-size: 0.9rem; opacity: 0.5; }
.search-input { flex: 1; border: none; outline: none; background: transparent; font-size: 0.9rem; color: var(--color-text); }
.search-input::placeholder { color: var(--color-text-light); opacity: 0.6; }
.filter-select { border: 1px solid var(--color-border); border-radius: 4px; padding: 6px 10px; background: #fff; font-size: 0.85rem; color: var(--color-text); cursor: pointer; }
</style>
