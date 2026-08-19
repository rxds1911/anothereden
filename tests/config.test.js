import { describe, expect, it } from 'vitest'
import {
  elementOptions,
  formOptions,
  lightShadowOptions,
  personalityOptions,
  taskCategories,
  weaponTypes,
  armorTypes,
  grastaTypes,
  storyEras,
  mapAreas,
  mapCategories,
  bookTypes,
  dungeonTypes,
  eventTypes,
  vowOptions
} from '../src/data/config.js'

const optionSets = {
  elementOptions,
  formOptions,
  lightShadowOptions,
  personalityOptions,
  taskCategories,
  weaponTypes,
  armorTypes,
  grastaTypes,
  storyEras,
  mapAreas,
  mapCategories,
  bookTypes,
  dungeonTypes,
  eventTypes,
  vowOptions
}

describe('config option lists', () => {
  it('every list is a non-empty array of unique non-blank strings', () => {
    for (const [name, list] of Object.entries(optionSets)) {
      expect(Array.isArray(list), `${name} is an array`).toBe(true)
      expect(list.length, `${name} is not empty`).toBeGreaterThan(0)
      expect(new Set(list).size, `${name} has no duplicates`).toBe(list.length)
      expect(list.every((v) => typeof v === 'string' && v.trim() !== ''), `${name} has no blank entries`).toBe(true)
    }
  })

  it('keeps the expected core values', () => {
    expect(elementOptions).toEqual(['火', '水', '风', '地', '无', '阴', '雷', '晶'])
    expect(formOptions).toEqual(['NS', 'AS', 'ES', 'AC'])
    expect(lightShadowOptions).toEqual(['天', '冥'])
    expect(weaponTypes).toEqual(['杖', '剑', '刀', '斧', '枪', '弓', '拳', '锤'])
    expect(armorTypes).toEqual(['手环', '项链', '戒指'])
    expect(grastaTypes).toEqual(['攻击', '生命', '支援', '特殊'])
    expect(storyEras).toEqual(['现代', '未来', '古代', '次元夹缝', '虚时层'])
    expect(mapCategories).toEqual(['城镇·村庄', '野外·迷宫'])
  })

  it('exposes every configured area for maps/diary data', () => {
    expect(mapAreas).toEqual([
      '席尔贝利亚大陆', '米古尼娜大陆', '嘉路雷亚大陆', '幻象界', '冥峡界',
      '蚀时领域', '石华人世界', '猫人世界', '机人世界'
    ])
  })

  it('keeps category lists relevant to their sections', () => {
    // 邂逅 is unique to events; every other event type is also a dungeon type
    expect(eventTypes.filter((t) => t !== '邂逅').every((t) => dungeonTypes.includes(t))).toBe(true)
    expect(eventTypes).toContain('邂逅')
    expect(vowOptions.length).toBeGreaterThanOrEqual(4)
    expect(bookTypes).toContain('主线剧情第1部')
    expect(taskCategories).toContain('主线第1部')
  })
})
