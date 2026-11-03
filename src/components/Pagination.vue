<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="列表分页">
    <div class="pagination-pages">
      <button
        type="button"
        class="pagination-btn pagination-nav"
        :disabled="safeCurrentPage <= 1"
        @click="goTo(safeCurrentPage - 1)"
      >上一页</button>
      <template v-for="item in visiblePages" :key="item.key">
        <span v-if="item.type === 'ellipsis'" class="pagination-ellipsis" aria-hidden="true">…</span>
        <button
          v-else
          type="button"
          class="pagination-btn pagination-page-btn"
          :class="{ active: item.page === safeCurrentPage }"
          :aria-current="item.page === safeCurrentPage ? 'page' : undefined"
          :aria-label="`第 ${item.page} 页`"
          @click="goTo(item.page)"
        >{{ item.page }}</button>
      </template>
      <button
        type="button"
        class="pagination-btn pagination-nav"
        :disabled="safeCurrentPage >= totalPages"
        @click="goTo(safeCurrentPage + 1)"
      >下一页</button>
    </div>
    <span class="pagination-summary">
      第 <strong>{{ safeCurrentPage }}</strong> / {{ totalPages }} 页，
      共 {{ totalItems }} 条，每页 {{ pageSize }} 条
    </span>
  </nav>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    currentPage: { type: Number, default: 1 },
    totalPages: { type: Number, required: true },
    totalItems: { type: Number, default: 0 },
    pageSize: { type: Number, required: true }
  },
  emits: ["update:currentPage"],
  computed: {
    safeCurrentPage() {
      return Math.min(Math.max(1, this.currentPage), Math.max(1, this.totalPages))
    },
    visiblePages() {
      const total = this.totalPages
      if (total <= 7) {
        return Array.from({ length: total }, (_, index) => ({
          type: "page",
          page: index + 1,
          key: `page-${index + 1}`
        }))
      }

      const current = this.safeCurrentPage
      if (current <= 4) {
        return [
          ...[1, 2, 3, 4, 5].map((page) => ({ type: "page", page, key: `page-${page}` })),
          { type: "ellipsis", key: "ellipsis-right" },
          { type: "page", page: total, key: `page-${total}` }
        ]
      }
      if (current >= total - 3) {
        return [
          { type: "page", page: 1, key: "page-1" },
          { type: "ellipsis", key: "ellipsis-left" },
          ...[total - 4, total - 3, total - 2, total - 1, total]
            .map((page) => ({ type: "page", page, key: `page-${page}` }))
        ]
      }
      return [
        { type: "page", page: 1, key: "page-1" },
        { type: "ellipsis", key: "ellipsis-left" },
        ...[-1, 0, 1].map((offset) => {
          const page = current + offset
          return { type: "page", page, key: `page-${page}` }
        }),
        { type: "ellipsis", key: "ellipsis-right" },
        { type: "page", page: total, key: `page-${total}` }
      ]
    }
  },
  methods: {
    goTo(page) {
      const next = Math.min(Math.max(1, page), this.totalPages)
      if (next !== this.safeCurrentPage) this.$emit("update:currentPage", next)
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px 20px;
  flex-wrap: wrap;
  margin-top: 26px;
  padding: 14px 16px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-bg-card);
  box-shadow: var(--shadow-sm);
}
.pagination-pages { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.pagination-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 11px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-card);
  color: var(--color-primary);
  font: inherit;
  font-size: .78rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color .18s, background .18s, color .18s;
}
.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: var(--color-table-hover);
}
.pagination-btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
.pagination-btn.active {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: var(--color-bg-card);
}
.pagination-btn:disabled { cursor: not-allowed; opacity: .42; }
.pagination-ellipsis {
  min-width: 24px;
  text-align: center;
  color: var(--color-text-light);
  font-weight: 700;
}
.pagination-summary { color: var(--color-text-light); font-size: .78rem; }
.pagination-summary strong { color: var(--color-accent); }
@media (max-width: 560px) {
  .pagination { align-items: flex-start; flex-direction: column; }
  .pagination-nav { padding: 0 8px; }
}
</style>
