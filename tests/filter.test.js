import { describe, expect, it } from 'vitest'
import { filterRows, hasActiveFilters } from '../src/utils/filter.js'

const items = [
  { id: 'alde', name: '阿尔德', type: '刀', element: '火', tags: ['主角', '剑术'] },
  { id: 'asami', name: '浅见', type: '剑', element: '水', tags: ['龙'] },
  { id: 'kikyo', name: '桔梗', type: '弓', element: '风', tags: ['龙', '法外'] }
]

describe('filterRows', () => {
  it('returns all rows when no filters or query are given', () => {
    expect(filterRows(items, {})).toHaveLength(3)
    expect(filterRows(items, { filters: [], query: '' })).toHaveLength(3)
  })

  it('filters by a single field with one selected value', () => {
    expect(filterRows(items, { filters: [{ field: 'type', values: ['刀'] }] }).map((r) => r.id)).toEqual(['alde'])
  })

  it('filters by a single field with multiple selected values', () => {
    expect(filterRows(items, { filters: [{ field: 'type', values: ['刀', '剑'] }] }).map((r) => r.id).sort()).toEqual(['alde', 'asami'])
  })

  it('filters array fields with arrayMatch when any value overlaps', () => {
    const result = filterRows(items, { filters: [{ field: 'tags', values: ['龙'], arrayMatch: true }] })
    expect(result.map((r) => r.id).sort()).toEqual(['asami', 'kikyo'])
  })

  it('matches across multiple fields with OR semantics', () => {
    expect(filterRows(items, { filters: [{ fields: ['element', 'type'], values: ['刀'] }] }).map((r) => r.id)).toEqual(['alde'])
    expect(filterRows(items, { filters: [{ fields: ['element', 'type'], values: ['剑', '风'] }] }).map((r) => r.id).sort()).toEqual(['asami', 'kikyo'])
  })

  it('applies AND semantics across separate filter groups', () => {
    const result = filterRows(items, {
      filters: [
        { field: 'type', values: ['刀'] },
        { field: 'element', values: ['火'] }
      ]
    })
    expect(result.map((r) => r.id)).toEqual(['alde'])
  })

  it('ignores filter groups with empty values', () => {
    expect(filterRows(items, { filters: [{ field: 'type', values: [] }, { field: 'element', values: ['火'] }] }).map((r) => r.id)).toEqual(['alde'])
  })

  it('searches all fields by default with case-insensitive matching', () => {
    expect(filterRows(items, { query: '阿尔德' }).map((r) => r.id)).toEqual(['alde'])
    expect(filterRows(items, { query: 'ALDE' }).map((r) => r.id)).toEqual(['alde'])
  })

  it('searches string array fields by default', () => {
    expect(filterRows(items, { query: '法外' }).map((r) => r.id)).toEqual(['kikyo'])
  })

  it('searches only the listed fields when searchFields is given', () => {
    const options = { query: '弓', searchFields: ['name', 'type'] }
    expect(filterRows(items, options).map((r) => r.id)).toEqual(['kikyo'])
    // '龙' exists in tags but tags is not in searchFields
    expect(filterRows(items, { query: '龙', searchFields: ['name', 'type'] })).toEqual([])
  })

  it('treats blank or whitespace-only queries as inactive', () => {
    expect(filterRows(items, { query: '   ' })).toHaveLength(3)
  })
})

describe('hasActiveFilters', () => {
  it('is false when nothing is selected and query is blank', () => {
    expect(hasActiveFilters({})).toBe(false)
    expect(hasActiveFilters({ query: '   ', filters: [{ field: 'type', values: [] }] })).toBe(false)
  })

  it('is true when any filter group has values or query is non-blank', () => {
    expect(hasActiveFilters({ filters: [{ field: 'type', values: ['刀'] }] })).toBe(true)
    expect(hasActiveFilters({ query: '阿尔德' })).toBe(true)
  })
})
