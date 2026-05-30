<template>
  <div>
    <header class="sidebar-header">
      <h1>另一个伊甸</h1>
      <span>攻略查询站</span>
    </header>
    <nav class="sidebar-nav">
      <a v-for="item in navItems" :key="item.id"
        :href="item.path"
        class="nav-item"
        :class="{ active: currentPage === item.id }">
        <span class="nav-icon">{{ item.icon }}</span>
        <span>{{ item.name }}</span>
      </a>
    </nav>
    <div class="sidebar-footer">v1.0 — 数据持续更新中</div>
  </div>
</template>

<script>
import { navItems } from '../data/nav.js'
export default {
  name: "AppSidebar",
  props: { currentPage: { type: String, default: "index" } },
  data() { return { navItems } }
}
</script>