// 通用列表筛选与搜索核心逻辑（纯函数，便于单元测试）
//
// filters 每项：
//   { field: 'type', values: [...] }                按字段精确匹配
//   { fields: ['element', 'type'], values: [...] }  跨字段 OR 匹配
//   { field: 'tags', values: [...], arrayMatch: true } 数组字段任意值匹配
// searchFields 指定搜索字段；不传则搜索行内所有字段

export function filterRows(list, options = {}) {
  const { query = '', filters = [], searchFields = null } = options

  let result = list
  for (const { field, fields, values = [], arrayMatch = false } of filters) {
    if (!values.length) continue
    const targets = fields || (field ? [field] : [])
    result = result.filter((r) =>
      arrayMatch
        ? values.some((v) => targets.some((t) => (r[t] || []).includes(v)))
        : values.some((v) => targets.some((t) => r[t] === v))
    )
  }

  if (query.trim()) {
    const q = query.toLowerCase()
    result = result.filter((r) => {
      if (searchFields) {
        return searchFields.some((k) => r[k] && r[k].toString().toLowerCase().includes(q))
      }
      return Object.values(r).some((v) => v && v.toString().toLowerCase().includes(q))
    })
  }

  return result
}

export function hasActiveFilters(options = {}) {
  const { query = '', filters = [] } = options
  return query.trim() !== '' || filters.some((f) => (f.values || []).length > 0)
}
