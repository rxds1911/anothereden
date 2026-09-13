<template>
  <div class="name-switch">
    <div class="name-switch-title">名称显示</div>
    <div class="name-switch-options">
      <button v-for="item in modes" :key="item.key" type="button"
        class="name-switch-btn" :class="{ active: mode === item.key }"
        @click="select(item.key)">{{ item.label }}</button>
    </div>
    <div class="name-switch-hint">角色 / 地图取自术语表，缺译名时自动回退</div>
  </div>
</template>

<script>
import { nameDisplayModes } from '../data/config.js'
import { nameDisplayState, setNameDisplayMode } from '../utils/name-display.js'

export default {
  name: "NameDisplaySwitch",
  computed: {
    modes() { return nameDisplayModes },
    mode() { return nameDisplayState.mode }
  },
  methods: {
    select(mode) { setNameDisplayMode(mode) }
  }
}
</script>
