<template>
  <div class="ss-select" ref="root">
    <div class="ss-control" :class="{ open }" @click="toggle">
      <span class="ss-value" :class="{ placeholder: !modelValue }">{{ modelValue || placeholder }}</span>
      <span v-if="modelValue" class="ss-clear" @click.stop="clear">✕</span>
      <span class="ss-arrow">▾</span>
    </div>
    <div v-if="open" class="ss-dropdown">
      <input
        ref="searchInput"
        v-model="query"
        type="text"
        class="ss-search"
        placeholder="输入姓名筛选..."
        @keydown.esc="close"
        @keydown.enter.prevent="pickFirst"
      />
      <div class="ss-options">
        <div
          v-for="(opt, i) in filteredOptions"
          :key="opt"
          class="ss-option"
          :class="{ active: opt === modelValue, hover: i === hoverIndex }"
          @mousedown.prevent
          @click="pick(opt)"
        >{{ opt }}</div>
        <div v-if="!filteredOptions.length" class="ss-empty">无匹配选项</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchableSelect",
  props: {
    modelValue: { type: String, default: "" },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: "请选择" }
  },
  emits: ["update:modelValue"],
  data() {
    return { open: false, query: "", hoverIndex: -1 }
  },
  computed: {
    filteredOptions() {
      const q = this.query.trim().toLowerCase()
      return q ? this.options.filter(o => o.toLowerCase().includes(q)) : this.options
    }
  },
  methods: {
    toggle() {
      this.open ? this.close() : this.openDropdown()
    },
    openDropdown() {
      this.open = true
      this.query = ""
      this.hoverIndex = -1
      this.$nextTick(() => {
        if (this.$refs.searchInput) this.$refs.searchInput.focus()
      })
    },
    close() {
      this.open = false
    },
    pick(opt) {
      this.$emit("update:modelValue", opt)
      this.close()
    },
    clear() {
      this.$emit("update:modelValue", "")
    },
    pickFirst() {
      if (this.filteredOptions.length) this.pick(this.filteredOptions[0])
    },
    onDocClick(e) {
      if (this.open && this.$refs.root && !this.$refs.root.contains(e.target)) {
        this.close()
      }
    }
  },
  mounted() {
    document.addEventListener("mousedown", this.onDocClick)
  },
  beforeUnmount() {
    document.removeEventListener("mousedown", this.onDocClick)
  }
}
</script>

<style scoped>
.ss-select {
  position: relative;
  min-width: 0;
}
.ss-control {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: #fff;
  font-size: .82rem;
  color: #333;
  cursor: pointer;
  user-select: none;
  transition: border-color .2s, box-shadow .2s;
}
.ss-control.open {
  border-color: #c8a84e;
  box-shadow: 0 0 0 3px rgba(200,168,78,0.1);
}
.ss-value {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ss-value.placeholder {
  color: #bbb;
}
.ss-clear {
  color: #ccc;
  font-size: .75rem;
  cursor: pointer;
  padding: 1px 4px;
  border-radius: 50%;
  transition: color .15s;
}
.ss-clear:hover {
  color: #c0392b;
}
.ss-arrow {
  color: #bbb;
  font-size: .7rem;
  transition: transform .2s;
  flex-shrink: 0;
}
.ss-control.open .ss-arrow {
  transform: rotate(180deg);
}
.ss-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 50;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.14);
  overflow: hidden;
}
.ss-search {
  width: 100%;
  box-sizing: border-box;
  padding: 9px 12px;
  border: none;
  border-bottom: 1px solid #f0f0f0;
  outline: none;
  font-size: .8rem;
  font-family: inherit;
}
.ss-search::placeholder {
  color: #bbb;
}
.ss-options {
  max-height: 180px;
  overflow-y: auto;
  padding: 4px;
}
.ss-option {
  padding: 8px 10px;
  border-radius: 8px;
  font-size: .82rem;
  color: #333;
  cursor: pointer;
  transition: background .15s;
}
.ss-option:hover,
.ss-option.hover {
  background: #f7f3e9;
  color: #1a2940;
}
.ss-option.active {
  background: rgba(200,168,78,0.16);
  color: #a8862f;
  font-weight: 700;
}
.ss-empty {
  padding: 12px;
  text-align: center;
  font-size: .78rem;
  color: #bbb;
}
</style>
