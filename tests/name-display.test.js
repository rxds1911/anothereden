import { beforeEach, describe, expect, it } from 'vitest'
import { defaultNameDisplayMode, nameDisplayModes } from '../src/data/config.js'
import { sampleCharacterGlossary } from '../src/data/samples/glossary.js'
import { sampleMapGlossary } from '../src/data/samples/map-glossary.js'
import {
  NAME_DISPLAY_STORAGE_KEY,
  characterSearchText,
  findCharacterGlossaryEntry,
  glossaryDisplayName,
  mapSearchText,
  nameDisplayState,
  resolveCharacterName,
  resolveMapName,
  setNameDisplayMode
} from '../src/utils/name-display.js'

const aldo = { id: 'alde', name: '阿尔德' }

beforeEach(() => {
  localStorage.clear()
  setNameDisplayMode(defaultNameDisplayMode)
})

describe('name display modes', () => {
  it('配置里提供日文名 / 国际服译名 / 国服译名三种模式', () => {
    expect(nameDisplayModes.map((m) => m.key)).toEqual(['internationalName', 'cnName', 'jpName'])
    expect(nameDisplayModes.map((m) => m.label)).toEqual(['国际服译名', '国服译名', '日文名'])
    expect(nameDisplayModes.some((m) => m.key === defaultNameDisplayMode)).toBe(true)
  })

  it('默认使用国际服译名，非法模式会被忽略', () => {
    expect(nameDisplayState.mode).toBe(defaultNameDisplayMode)
    setNameDisplayMode('unknown')
    expect(nameDisplayState.mode).toBe(defaultNameDisplayMode)
  })

  it('把用户选择写入 localStorage，并在下次启动时恢复', () => {
    setNameDisplayMode('jpName')
    expect(localStorage.getItem(NAME_DISPLAY_STORAGE_KEY)).toBe('jpName')
    expect(nameDisplayState.mode).toBe('jpName')
  })
})

describe('character glossary names', () => {
  it('按显示模式给出阿尔德的不同译名', () => {
    expect(resolveCharacterName(aldo, 'internationalName')).toBe('阿尔德')
    expect(resolveCharacterName(aldo, 'cnName')).toBe('阿鲁多')
    expect(resolveCharacterName(aldo, 'jpName')).toBe('アルド')
  })

  it('跟随全局模式自动变化', () => {
    setNameDisplayMode('jpName')
    expect(resolveCharacterName(aldo)).toBe('アルド')
    setNameDisplayMode('cnName')
    expect(resolveCharacterName(aldo)).toBe('阿鲁多')
  })

  it('术语表缺少所选译名时逐级回退', () => {
    const entry = sampleCharacterGlossary.find((e) => e.jpName && e.internationalName && !e.cnName)
    expect(entry).toBeTruthy()
    const character = { id: 'x', name: entry.internationalName }
    expect(resolveCharacterName(character, 'cnName')).toBe(entry.internationalName)
    expect(glossaryDisplayName(entry, 'jpName')).toBe(entry.jpName)
  })

  it('术语表里查不到时沿用数据里的原始名称', () => {
    const unknown = { id: 'x', name: '不存在的角色' }
    for (const mode of nameDisplayModes.map((m) => m.key)) {
      expect(resolveCharacterName(unknown, mode)).toBe('不存在的角色')
    }
  })

  it('用别称也能匹配到同一条术语表条目', () => {
    const entry = findCharacterGlossaryEntry('阿尔德')
    const alias = entry.alias.split('/')[0]
    expect(resolveCharacterName({ id: 'x', name: alias }, 'jpName')).toBe(entry.jpName)
  })

  it('搜索文本包含日文名 / 国际服译名 / 国服译名 / 别称', () => {
    const text = characterSearchText(aldo)
    expect(text).toContain('阿尔德')
    expect(text).toContain('阿鲁多')
    expect(text).toContain('アルド')
    expect(text).toContain('男主')
    expect(characterSearchText(null)).toBe('')
  })
})

describe('map glossary names', () => {
  const entry = sampleMapGlossary.find((e) => e.jpName === '魔獣城')

  it('地图同样提供三种译名', () => {
    expect(entry).toBeTruthy()
    const map = { id: 20, name: entry.internationalName }
    expect(resolveMapName(map, 'internationalName')).toBe(entry.internationalName)
    expect(resolveMapName(map, 'jpName')).toBe(entry.jpName)
  })

  it('地图术语表查不到时沿用原始名称', () => {
    expect(resolveMapName({ id: 1, name: '示例地图' }, 'jpName')).toBe('示例地图')
    expect(resolveMapName(null)).toBe('')
  })

  it('地图搜索文本包含术语表里的名称', () => {
    const text = mapSearchText({ id: 20, name: entry.internationalName })
    expect(text).toContain(entry.jpName)
    expect(mapSearchText(null)).toBe('')
  })
})
