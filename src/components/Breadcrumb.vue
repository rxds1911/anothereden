<template>
  <div class="breadcrumb">
    <a href="/index.html">首页</a>
    <span class="sep">/</span>
    <span>{{ current }}</span>
  </div>
</template>

<script>
export default { name: "Breadcrumb", props: { current: { type: String, required: true } } }
</script>

<style scoped>
.breadcrumb { font-size: 0.8rem; color: var(--color-text-light); }
.breadcrumb a { color: var(--color-text-light); text-decoration: none; }
.breadcrumb a:hover { color: var(--color-accent); }
.sep { margin: 0 6px; opacity: 0.4; }
</style>
