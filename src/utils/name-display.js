// 全局名称显示模式：按术语表切换角色 / 地图的默认显示名称
//
// 取值来自 config.js 的 nameDisplayModes（internationalName / cnName / jpName）。
// 术语表缺少所选译名时按固定顺序回退：所选译名 -> 国际服译名 -> 国服译名 -> 日文名 -> 数据原始名称。
// 用户选择保存在 localStorage，刷新或切换页面后依然生效。
import { reactive } from 'vue'
import { nameDisplayModes, defaultNameDisplayMode } from '../data/config.js'
import { sampleCharacterGlossary } from '../data/samples/glossary.js'
import { sampleMapGlossary } from '../data/samples/map-glossary.js'

export const NAME_DISPLAY_STORAGE_KEY = 'anothereden.nameDisplayMode'

function normalize(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function splitAliases(alias) {
  return String(alias || '')
    .split(/[\/、,，]/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function buildIndex(list, extraKeys) {
  const index = new Map()
  for (const entry of list) {
    for (const rawKey of extraKeys(entry)) {
      const key = normalize(rawKey)
      // 同一名称对应多条时保留先出现的条目，避免索引被覆盖
      if (key && !index.has(key)) index.set(key, entry)
    }
  }
  return index
}

// 角色术语表索引：日文名 / 国际服译名 / 国服译名 / 别称均可查到
export const characterGlossaryIndex = buildIndex(
  sampleCharacterGlossary,
  (entry) => [entry.jpName, entry.internationalName, entry.cnName, ...splitAliases(entry.alias)]
)

// 地图术语表索引：日文名 / 国际服译名 / 国服译名均可查到
export const mapGlossaryIndex = buildIndex(
  sampleMapGlossary,
  (entry) => [entry.jpName, entry.internationalName, entry.cnName]
)

export function findCharacterGlossaryEntry(name) {
  return characterGlossaryIndex.get(normalize(name)) || null
}

export function findMapGlossaryEntry(name) {
  return mapGlossaryIndex.get(normalize(name)) || null
}

export function isNameDisplayMode(mode) {
  return nameDisplayModes.some((item) => item.key === mode)
}

function readStoredMode() {
  try {
    const stored = localStorage.getItem(NAME_DISPLAY_STORAGE_KEY)
    return isNameDisplayMode(stored) ? stored : defaultNameDisplayMode
  } catch (error) {
    return defaultNameDisplayMode
  }
}

// 全局共享的显示模式状态，页面 computed 读取它即可自动更新
export const nameDisplayState = reactive({ mode: readStoredMode() })

export function setNameDisplayMode(mode) {
  if (!isNameDisplayMode(mode)) return nameDisplayState.mode
  nameDisplayState.mode = mode
  try {
    localStorage.setItem(NAME_DISPLAY_STORAGE_KEY, mode)
  } catch (error) {
    // 存储不可用时仅本次会话生效
  }
  return nameDisplayState.mode
}

// 术语表条目按指定模式取名，缺译名时逐级回退
export function glossaryDisplayName(entry, mode = nameDisplayState.mode) {
  if (!entry) return ''
  return normalize(entry[mode])
    || normalize(entry.internationalName)
    || normalize(entry.cnName)
    || normalize(entry.jpName)
}

// 术语表条目已知的全部名称与别称（用于搜索与展示备选名）
export function glossaryNameVariants(entry) {
  if (!entry) return []
  const names = [entry.internationalName, entry.cnName, entry.jpName, ...splitAliases(entry.alias)]
  return [...new Set(names.map(normalize).filter(Boolean))]
}

export function resolveCharacterName(character, mode = nameDisplayState.mode) {
  if (!character) return ''
  const entry = findCharacterGlossaryEntry(character.name) || findCharacterGlossaryEntry(character.jpName)
  return glossaryDisplayName(entry, mode) || normalize(character.name)
}

export function resolveMapName(map, mode = nameDisplayState.mode) {
  if (!map) return ''
  const entry = findMapGlossaryEntry(map.name) || findMapGlossaryEntry(map.jpName)
  return glossaryDisplayName(entry, mode) || normalize(map.name)
}

// 搜索用文本：把原始名称与术语表里的所有名称拼在一起，任何译名都能搜到
export function characterSearchText(character) {
  if (!character) return ''
  const entry = findCharacterGlossaryEntry(character.name) || findCharacterGlossaryEntry(character.jpName)
  const names = [normalize(character.name), ...glossaryNameVariants(entry)]
  return [...new Set(names.filter(Boolean))].join(' ')
}

export function mapSearchText(map) {
  if (!map) return ''
  const entry = findMapGlossaryEntry(map.name) || findMapGlossaryEntry(map.jpName)
  const names = [normalize(map.name), ...glossaryNameVariants(entry)]
  return [...new Set(names.filter(Boolean))].join(' ')
}
