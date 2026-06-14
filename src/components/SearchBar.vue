<template>
  <div class="search-wrap">
    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input type="text" :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="search-input" />
      <span v-if="modelValue" class="search-clear" @click="$emit('update:modelValue', '')">✕</span>
    </div>
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
.search-wrap { margin-bottom: 20px; }
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 10px 16px;
  max-width: 480px;
  transition: all .2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.search-bar:focus-within {
  border-color: #c8a84e;
  box-shadow: 0 0 0 3px rgba(200,168,78,0.1);
}
.search-icon { font-size: .9rem; opacity: 0.4; flex-shrink: 0; }
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: .88rem;
  color: #2c2c2c;
  font-family: inherit;
}
.search-input::placeholder { color: #bbb; }
.search-clear {
  font-size: .75rem;
  color: #ccc;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 50%;
  transition: all .15s;
  flex-shrink: 0;
}
.search-clear:hover { color: #c8a84e; background: rgba(200,168,78,0.08); }
</style>