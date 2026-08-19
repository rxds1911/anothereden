import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  elementOptions,
  formOptions,
  lightShadowOptions,
  weaponTypes,
  armorTypes,
  grastaTypes,
  storyEras,
  mapAreas,
  mapCategories,
  bookTypes,
  dungeonTypes,
  eventTypes,
  taskCategories
} from '../src/data/config.js'
import { sampleCharacters } from '../src/data/samples/characters.js'
import { sampleBattles } from '../src/data/samples/battle.js'
import { sampleWeapons } from '../src/data/samples/weapons.js'
import { sampleArmor } from '../src/data/samples/armor.js'
import { sampleBadges } from '../src/data/samples/badges.js'
import { sampleCats } from '../src/data/samples/cats.js'
import { sampleEvents } from '../src/data/samples/events.js'
import { sampleBookshelf } from '../src/data/samples/bookshelf.js'
import { sampleDiary } from '../src/data/samples/diary.js'
import { sampleMaps } from '../src/data/samples/maps.js'
import { sampleDungeons } from '../src/data/samples/dungeons.js'
import { sampleGrasta } from '../src/data/samples/grasta.js'
import { samplePartners } from '../src/data/samples/partner.js'
import { samplePersonalWeapons } from '../src/data/samples/personal-weapons.js'
import { sampleReincarnation } from '../src/data/samples/reincarnation.js'

const projectRoot = process.cwd()
const characterNames = new Set(sampleCharacters.map((c) => c.name))

function expectUniqueIds(list) {
  expect(new Set(list.map((x) => x.id)).size, 'ids are unique').toBe(list.length)
}

function expectRequiredStrings(list, fields) {
  for (const row of list) {
    for (const field of fields) {
      expect(typeof row[field], `${row.id || row.name}.${field}`).toBe('string')
      expect(row[field].trim(), `${row.id || row.name}.${field} is non-blank`).not.toBe('')
    }
  }
}

function expectFileExists(urlPath) {
  const file = resolve(projectRoot, 'public', urlPath.replace(/^\//, ''))
  expect(existsSync(file), `file exists: ${urlPath}`).toBe(true)
}

describe('sample data lists', () => {
  it('every sample list is a non-empty array', () => {
    const lists = [
      sampleCharacters, sampleBattles, sampleWeapons, sampleArmor, sampleBadges,
      sampleCats, sampleEvents, sampleBookshelf, sampleDiary, sampleMaps,
      sampleDungeons, sampleGrasta, samplePartners, samplePersonalWeapons,
      sampleReincarnation
    ]
    for (const list of lists) {
      expect(Array.isArray(list)).toBe(true)
      expect(list.length).toBeGreaterThan(0)
    }
  })

  it('characters have unique ids and consistent enum fields', () => {
    expectUniqueIds(sampleCharacters)
    expectRequiredStrings(sampleCharacters, ['name', 'element', 'weapon', 'title', 'form', 'lightShadow'])
    for (const c of sampleCharacters) {
      expect(elementOptions).toContain(c.element)
      expect(weaponTypes).toContain(c.weapon)
      expect(formOptions).toContain(c.form)
      expect(lightShadowOptions).toContain(c.lightShadow)
      expect(Array.isArray(c.personality)).toBe(true)
      expect(c.personality.length).toBeGreaterThan(0)
      expect(c.personality.every((p) => typeof p === 'string' && p.trim() !== '')).toBe(true)
    }
  })

  it('characters define well-formed skills and star guide abilities', () => {
    for (const c of sampleCharacters) {
      expect(Array.isArray(c.skills)).toBe(true)
      for (const skill of c.skills) {
        expectRequiredStrings([skill], ['name', 'type', 'desc', 'skillType', 'level'])
        expect(typeof skill.cost).toBe('number')
      }
      if (c.starGuide === '已开放') {
        expect(c.starGuideAbilities).toBeTruthy()
        expect(Array.isArray(c.starGuideAbilities.tenmei)).toBe(true)
        expect(c.starGuideAbilities.tenmei.length).toBeGreaterThan(0)
        expect(Array.isArray(c.starGuideAbilities.starSkills)).toBe(true)
        expect(Array.isArray(c.starGuideAbilities.abilityGain)).toBe(true)
        expect(Array.isArray(c.starGuideAbilities.burstEnhance)).toBe(true)
      } else if (c.starGuideAbilities) {
        // Not-yet-released characters may still carry tenmei rows
        expect(Array.isArray(c.starGuideAbilities.tenmei)).toBe(true)
        expect(c.starGuideAbilities.tenmei.length).toBeGreaterThan(0)
      }
    }
  })

  it('weapons have unique ids, valid types and numeric stats', () => {
    expectUniqueIds(sampleWeapons)
    expectRequiredStrings(sampleWeapons, ['name', 'type', 'effect', 'source', 'condition'])
    for (const w of sampleWeapons) {
      expect(weaponTypes).toContain(w.type)
      expect(typeof w.equipLevel).toBe('number')
      expect(typeof w.atk).toBe('number')
      expect(typeof w.matk).toBe('number')
      if (w.character) {
        expect(characterNames, `${w.name} character exists`).toContain(w.character)
        expect(w.condition).toBe(w.character)
      }
    }
  })

  it('armor has unique ids, valid types and numeric stats', () => {
    expectUniqueIds(sampleArmor)
    expectRequiredStrings(sampleArmor, ['name', 'type', 'effect', 'source', 'condition'])
    for (const a of sampleArmor) {
      expect(armorTypes).toContain(a.type)
      expect(typeof a.equipLevel).toBe('number')
      expect(typeof a.def).toBe('number')
      expect(typeof a.mdef).toBe('number')
      if (a.character) expect(characterNames).toContain(a.character)
    }
  })

  it('badges have unique names and non-empty fields', () => {
    expect(new Set(sampleBadges.map((b) => b.name)).size).toBe(sampleBadges.length)
    expectRequiredStrings(sampleBadges, ['name', 'effect', 'source'])
  })

  it('battles have unique ids and valid task categories', () => {
    expectUniqueIds(sampleBattles)
    expectRequiredStrings(sampleBattles, ['name', 'level', 'location', 'reward', 'taskCategory'])
    for (const b of sampleBattles) {
      expect(taskCategories).toContain(b.taskCategory)
      expect(typeof b.isHiddenBoss).toBe('boolean')
      if (b.isHiddenBoss) {
        expect(typeof b.hp).toBe('string')
        expect(Array.isArray(b.skills)).toBe(true)
        expect(b.skills.length).toBeGreaterThan(0)
        expect(typeof b.strategy).toBe('string')
        expect(Array.isArray(b.detailedRewards)).toBe(true)
      }
    }
  })

  it('cats have unique ids and non-empty fields', () => {
    expectUniqueIds(sampleCats)
    expectRequiredStrings(sampleCats, ['name', 'home', 'condition', 'gender', 'personality'])
  })

  it('events have unique ids, valid types and existing screenshots', () => {
    expectUniqueIds(sampleEvents)
    expectRequiredStrings(sampleEvents, ['name', 'type', 'image', 'url'])
    for (const e of sampleEvents) {
      expect(eventTypes).toContain(e.type)
      expectFileExists(e.image)
    }
  })

  it('bookshelf entries have unique ids and valid types', () => {
    expectUniqueIds(sampleBookshelf)
    expectRequiredStrings(sampleBookshelf, ['name', 'type', 'bonus'])
    for (const b of sampleBookshelf) expect(bookTypes).toContain(b.type)
  })

  it('diary entries have unique ids and valid era/area values', () => {
    expectUniqueIds(sampleDiary)
    expectRequiredStrings(sampleDiary, ['name', 'era', 'area'])
    for (const d of sampleDiary) {
      expect(storyEras).toContain(d.era)
      expect(mapAreas).toContain(d.area)
    }
  })

  it('maps have unique ids and valid era/area/category values', () => {
    expectUniqueIds(sampleMaps)
    expectRequiredStrings(sampleMaps, ['name', 'era', 'area', 'category'])
    for (const m of sampleMaps) {
      expect(storyEras).toContain(m.era)
      expect(mapAreas).toContain(m.area)
      expect(mapCategories).toContain(m.category)
    }
  })

  it('dungeons have unique ids, valid types, difficulties and rewards', () => {
    expectUniqueIds(sampleDungeons)
    expectRequiredStrings(sampleDungeons, ['name', 'type', 'recLevel', 'reward', 'memoryBook'])
    for (const d of sampleDungeons) {
      expect(dungeonTypes).toContain(d.type)
      expect(['天', '冥', '天冥']).toContain(d.reward)
      expect(Array.isArray(d.difficulties)).toBe(true)
      expect(d.difficulties.length).toBeGreaterThan(0)
      expect(d.difficulties.every((x) => typeof x === 'string')).toBe(true)
    }
  })

  it('grasta has unique ids and valid types', () => {
    expectUniqueIds(sampleGrasta)
    expectRequiredStrings(sampleGrasta, ['name', 'type', 'ability', 'condition', 'effect', 'source'])
    for (const g of sampleGrasta) expect(grastaTypes).toContain(g.type)
  })

  it('partners have unique ids and rarities in 3-5 star range', () => {
    expectUniqueIds(samplePartners)
    expectRequiredStrings(samplePartners, ['name', 'rarity', 'source'])
    for (const p of samplePartners) expect(p.rarity).toMatch(/^[3-5]星$/)
  })

  it('personal weapons reference known characters and valid tabs', () => {
    expectUniqueIds(samplePersonalWeapons)
    expectRequiredStrings(samplePersonalWeapons, ['name', 'character', 'tab', 'effect'])
    for (const w of samplePersonalWeapons) {
      expect(['结果', '显现']).toContain(w.tab)
      expect(characterNames).toContain(w.character)
    }
  })

  it('reincarnation trials have unique ids, valid difficulties and existing images', () => {
    expectUniqueIds(sampleReincarnation)
    expectRequiredStrings(sampleReincarnation, ['name', 'difficulty', 'image'])
    for (const r of sampleReincarnation) {
      expect(['Normal', 'Extreme']).toContain(r.difficulty)
      expectFileExists(r.image)
    }
  })
})
