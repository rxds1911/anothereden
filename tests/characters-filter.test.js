import { describe, expect, it } from 'vitest'
import { filterCharacters, hasActiveCharacterFilters } from '../src/utils/characters-filter.js'

const characters = [
  {
    id: 'alde',
    name: '阿尔德',
    title: '被选中的少年',
    element: '火',
    weapon: '刀',
    form: 'NS',
    lightShadow: '天',
    personality: ['主人公', '天之指引'],
    description: '从异世界被召唤而来的少年',
    skills: [{ name: '火焰斩', type: '火' }]
  },
  {
    id: 'asami',
    name: '浅见',
    title: '水之都剑士',
    element: '水',
    weapon: '剑',
    form: 'AS',
    lightShadow: '冥',
    personality: ['龙'],
    description: '来自水之都市的女剑士',
    skills: [{ name: '龙鳞击', type: '水' }]
  },
  {
    id: 'kikyo',
    name: '桔梗',
    title: '风之森精灵',
    element: '风',
    weapon: '弓',
    form: 'NS',
    lightShadow: '天',
    personality: ['龙', '法外之人'],
    description: '风之森的精灵族少女',
    skills: [{ name: '疾风矢', type: '风' }]
  }
]

describe('filterCharacters', () => {
  it('returns all characters when no filters are applied', () => {
    expect(filterCharacters(characters, {})).toHaveLength(3)
  })

  it('filters by weapon list', () => {
    const result = filterCharacters(characters, { weapon: ['刀', '剑'] })
    expect(result.map((c) => c.id).sort()).toEqual(['alde', 'asami'])
  })

  it('filters by element', () => {
    const result = filterCharacters(characters, { element: ['火'] })
    expect(result.map((c) => c.id)).toEqual(['alde'])
  })

  it('filters by form', () => {
    const result = filterCharacters(characters, { form: ['AS'] })
    expect(result.map((c) => c.id)).toEqual(['asami'])
  })

  it('filters by personality with any match', () => {
    const result = filterCharacters(characters, { personality: ['龙'] })
    expect(result.map((c) => c.id).sort()).toEqual(['asami', 'kikyo'])
  })

  it('filters by lightShadow', () => {
    const result = filterCharacters(characters, { lightShadow: ['天'] })
    expect(result.map((c) => c.id).sort()).toEqual(['alde', 'kikyo'])
  })

  it('matches search query against name', () => {
    expect(filterCharacters(characters, { query: '阿尔德' }).map((c) => c.id)).toEqual(['alde'])
  })

  it('matches search query against title', () => {
    expect(filterCharacters(characters, { query: '少年' }).map((c) => c.id)).toEqual(['alde'])
  })

  it('matches search query against element', () => {
    expect(filterCharacters(characters, { query: '风' }).map((c) => c.id)).toEqual(['kikyo'])
  })

  it('matches search query against personality', () => {
    expect(filterCharacters(characters, { query: '法外之人' }).map((c) => c.id)).toEqual(['kikyo'])
  })

  it('does not search description, id, or other fields', () => {
    expect(filterCharacters(characters, { query: '来自异世界' })).toEqual([])
    expect(filterCharacters(characters, { query: '都市' })).toEqual([])
    expect(filterCharacters(characters, { query: 'alde' })).toEqual([])
  })

  it('matches 的 only through searched fields, not descriptions', () => {
    expect(filterCharacters(characters, { query: '的' }).map((c) => c.id)).toEqual(['alde'])
  })

  it('applies combined filters with AND semantics', () => {
    const result = filterCharacters(characters, { weapon: ['刀'], element: ['火'] })
    expect(result.map((c) => c.id)).toEqual(['alde'])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterCharacters(characters, { weapon: ['枪'] })).toEqual([])
  })
})

describe('hasActiveCharacterFilters', () => {
  it('is false when no filter or query is set', () => {
    expect(hasActiveCharacterFilters({})).toBe(false)
    expect(hasActiveCharacterFilters({ query: '   ' })).toBe(false)
  })

  it('is true when any filter or non-blank query is set', () => {
    expect(hasActiveCharacterFilters({ weapon: ['刀'] })).toBe(true)
    expect(hasActiveCharacterFilters({ element: ['火'] })).toBe(true)
    expect(hasActiveCharacterFilters({ personality: ['龙'] })).toBe(true)
    expect(hasActiveCharacterFilters({ lightShadow: ['天'] })).toBe(true)
    expect(hasActiveCharacterFilters({ query: '阿尔德' })).toBe(true)
  })
})
