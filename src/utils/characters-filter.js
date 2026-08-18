// 角色列表的筛选与搜索（基于通用 filterRows 的角色版封装）
import { filterRows, hasActiveFilters } from './filter.js'

export function filterCharacters(list, filters = {}) {
  const {
    weapon = [],
    element = [],
    form = [],
    personality = [],
    lightShadow = [],
    query = ''
  } = filters
  return filterRows(list, {
    query,
    searchFields: ['name', 'title', 'element', 'personality'],
    filters: [
      { field: 'weapon', values: weapon },
      { field: 'element', values: element },
      { field: 'form', values: form },
      { field: 'personality', values: personality, arrayMatch: true },
      { field: 'lightShadow', values: lightShadow }
    ]
  })
}

export function hasActiveCharacterFilters(filters = {}) {
  const {
    weapon = [],
    element = [],
    form = [],
    personality = [],
    lightShadow = [],
    query = ''
  } = filters
  return hasActiveFilters({
    query,
    filters: [
      { field: 'weapon', values: weapon },
      { field: 'element', values: element },
      { field: 'form', values: form },
      { field: 'personality', values: personality },
      { field: 'lightShadow', values: lightShadow }
    ]
  })
}
