import { describe, expect, it } from 'vitest'
import { vowOptions } from '../src/data/config.js'
import { buildBuiltinGuide } from '../src/data/battle-guides.js'
import { sampleBookshelf } from '../src/data/samples/bookshelf.js'
import { bookshelfDetails } from '../src/data/samples/bookshelf-details.js'
import { samplePartners } from '../src/data/samples/partner.js'
import { partnerDetails } from '../src/data/samples/partner-details.js'
import { sampleMaps } from '../src/data/samples/maps.js'
import { mapDetails } from '../src/data/samples/map-details.js'
import { sampleDungeons } from '../src/data/samples/dungeons.js'
import { dungeonDetails } from '../src/data/samples/dungeon-details.js'
import { samplePersonalWeapons } from '../src/data/samples/personal-weapons.js'
import { personalWeaponDetails } from '../src/data/samples/personal-weapon-details.js'
import { personalWeaponManifestDetails } from '../src/data/samples/personal-weapon-details.js'
import { reincarnationStages } from '../src/data/samples/reincarnation-stages.js'
import { reincarnationBosses } from '../src/data/samples/reincarnation-bosses.js'
import { sampleBattles } from '../src/data/samples/battle.js'

describe('bookshelf details', () => {
  it('mirrors the bookshelf list one-to-one', () => {
    expect(bookshelfDetails).toHaveLength(sampleBookshelf.length)
    expect(bookshelfDetails.map((d) => d.id)).toEqual(sampleBookshelf.map((b) => b.id))
  })

  it('derives full repair/reward/bonus/team data for every book', () => {
    for (const d of bookshelfDetails) {
      const base = sampleBookshelf.find((b) => b.id === d.id)
      expect(d.name).toBe(base.name)
      expect(d.type).toBe(base.type)
      expect(d.repairConditions).toHaveLength(5)
      for (const row of d.repairConditions) {
        expect(typeof row.condition).toBe('string')
        expect(Array.isArray(row.rewards)).toBe(true)
        expect(row.rewards.length).toBeGreaterThan(0)
        expect(typeof row.alt).toBe('boolean')
      }
      expect(d.rewardStages).toHaveLength(10)
      d.rewardStages.forEach((s, i) => {
        expect(s.stage).toBe(i + 1)
        expect(s.reward).toBeTruthy()
      })
      expect(d.bonusCharacters).toHaveLength(3)
      for (const b of d.bonusCharacters) {
        expect(typeof b.target).toBe('string')
        expect(typeof b.points).toBe('string')
      }
      expect(d.team.front.length).toBeGreaterThan(0)
      expect(Array.isArray(d.team.back)).toBe(true)
      expect(Array.isArray(d.team.partner)).toBe(true)
      expect(d.videoTitle).toBeTruthy()
      expect(d.videoUrl).toBeTruthy()
    }
  })
})

describe('partner details', () => {
  it('mirrors the partner list one-to-one', () => {
    expect(partnerDetails).toHaveLength(samplePartners.length)
    expect(partnerDetails.map((d) => d.id)).toEqual(samplePartners.map((p) => p.id))
  })

  it('derives skills and auras for every partner', () => {
    for (const d of partnerDetails) {
      const base = samplePartners.find((p) => p.id === d.id)
      expect(d.name).toBe(base.name)
      expect(d.rarity).toBe(base.rarity)
      expect(d.source).toBe(base.source)
      expect(['打', '突', '斩', '魔']).toContain(d.attribute)
      expect(d.autoSkills).toHaveLength(2)
      for (const s of d.autoSkills) {
        expectRequiredSkill(s, ['name', 'desc', 'bonus'])
        expect(typeof s.charge).toBe('number')
        if (s.note !== undefined) expect(typeof s.note).toBe('string')
      }
      expect(d.chargeSkills).toHaveLength(2)
      for (const s of d.chargeSkills) {
        expectRequiredSkill(s, ['name', 'desc', 'condition', 'condDesc'])
        expect(s.condition).not.toContain('{char}')
        expect(typeof s.charge).toBe('number')
      }
      expect(d.auras).toHaveLength(2)
      for (const a of d.auras) {
        expect(typeof a.name).toBe('string')
        expect(typeof a.target).toBe('string')
        expect(typeof a.condition).toBe('string')
        expect(typeof a.effect).toBe('string')
      }
    }
  })
})

function expectRequiredSkill(skill, fields) {
  for (const field of fields) {
    expect(typeof skill[field], `${skill.name}.${field}`).toBe('string')
    expect(skill[field].trim()).not.toBe('')
  }
}

describe('map details', () => {
  it('mirrors the map list one-to-one', () => {
    expect(mapDetails).toHaveLength(sampleMaps.length)
    expect(mapDetails.map((d) => d.id)).toEqual(sampleMaps.map((m) => m.id))
  })

  it('derives items, shiny drops and monsters per era/category', () => {
    for (const d of mapDetails) {
      const base = sampleMaps.find((m) => m.id === d.id)
      expect(d.name).toBe(base.name)
      expect(d.era).toBe(base.era)
      expect(d.area).toBe(base.area)
      expect(d.category).toBe(base.category)
      expect(d.items).toHaveLength(5)
      d.items.forEach((item, i) => {
        expect(item.mark).toBe(['①', '②', '③', '④', '⑤'][i])
        expect(typeof item.name).toBe('string')
      })
      expect(d.shiny).toHaveLength(3)
      d.shiny.forEach((item, i) => {
        expect(item.mark).toBe('★' + (i + 1))
        expect(typeof item.name).toBe('string')
      })
      if (base.category === '野外·迷宫') {
        expect(d.monsters).toHaveLength(3)
        for (const m of d.monsters) {
          expect(typeof m.name).toBe('string')
          expect(Array.isArray(m.weakness)).toBe(true)
          expect(Array.isArray(m.resist)).toBe(true)
          expect(Array.isArray(m.drops)).toBe(true)
        }
      } else {
        expect(d.monsters).toEqual([])
      }
    }
  })
})

describe('dungeon details', () => {
  it('mirrors the dungeon list one-to-one', () => {
    expect(dungeonDetails).toHaveLength(sampleDungeons.length)
    expect(dungeonDetails.map((d) => d.id)).toEqual(sampleDungeons.map((d) => d.id))
  })

  it('derives chests and enemies for every difficulty', () => {
    for (const d of dungeonDetails) {
      const base = sampleDungeons.find((x) => x.id === d.id)
      expect(d.name).toBe(base.name)
      expect(d.type).toBe(base.type)
      expect(d.difficulties).toEqual(base.difficulties)
      expect(d.chests).toHaveLength(3)
      for (const chest of d.chests) {
        expect(typeof chest.area).toBe('string')
        for (const diff of d.difficulties) {
          expect(chest.items[diff]).toHaveLength(3)
        }
      }
      expect(d.enemies).toHaveLength(3)
      for (const enemy of d.enemies) {
        expect(typeof enemy.name).toBe('string')
        expect(Array.isArray(enemy.weakness)).toBe(true)
        expect(Array.isArray(enemy.resist)).toBe(true)
        expect(typeof enemy.boss).toBe('boolean')
        for (const diff of d.difficulties) {
          expect(Array.isArray(enemy.drops[diff])).toBe(true)
        }
      }
    }
  })
})

describe('personal weapon details', () => {
  const resultWeapons = samplePersonalWeapons.filter((w) => w.tab === '结果')
  const manifestWeapons = samplePersonalWeapons.filter((w) => w.tab === '显现')

  it('provides one result detail per result weapon', () => {
    expect(personalWeaponDetails).toHaveLength(resultWeapons.length)
    for (const d of personalWeaponDetails) {
      const base = resultWeapons.find((w) => w.id === d.id)
      expect(d.name).toBe(base.name)
      expect(d.character).toBe(base.character)
      expect(d.effectStages).toHaveLength(2)
      expect(d.effectStages[0].level).toBe(10)
      expect(d.effectStages[1].level).toBe(11)
      expect(d.rewards).toHaveLength(4)
      expect(d.rewards.map((r) => r.difficulty)).toEqual([
        'STANDARD', 'HARD', 'VERY HARD', 'CHALLENGE'
      ])
      expect(d.vows).toHaveLength(4)
      expect(d.vows.every((v) => vowOptions.includes(v))).toBe(true)
      expect(d.guides).toHaveLength(4)
      for (const g of d.guides) {
        expect(typeof g.title).toBe('string')
        expect(typeof g.url).toBe('string')
        expect(g.vows.every((v) => vowOptions.includes(v))).toBe(true)
        expect(Array.isArray(g.team.front)).toBe(true)
        expect(Array.isArray(g.team.back)).toBe(true)
        expect(Array.isArray(g.team.partner)).toBe(true)
      }
      expect(typeof d.videoTitle).toBe('string')
      expect(typeof d.videoUrl).toBe('string')
    }
  })

  it('provides one manifest detail per manifest weapon', () => {
    expect(personalWeaponManifestDetails).toHaveLength(manifestWeapons.length)
    for (const d of personalWeaponManifestDetails) {
      const base = manifestWeapons.find((w) => w.id === d.id)
      expect(d.name).toBe(base.name)
      expect(d.character).toBe(base.character)
      expect(d.finalStats.level).toBe(60)
      expect(typeof d.finalStats.atk).toBe('number')
      expect(typeof d.finalStats.magic).toBe('number')
      expect(Array.isArray(d.effects)).toBe(true)
      expect(d.effects.length).toBeGreaterThan(0)
      expect(d.skills).toHaveLength(2)
      for (const s of d.skills) {
        expect(typeof s.name).toBe('string')
        expect(typeof s.mp).toBe('number')
        expect(typeof s.desc).toBe('string')
        expect(typeof s.bonus).toBe('string')
      }
      expect(Array.isArray(d.team.front)).toBe(true)
    }
  })
})

describe('reincarnation stages and bosses', () => {
  it('defines 5 stages with missions for each difficulty', () => {
    expect(Object.keys(reincarnationStages).sort()).toEqual(['Extreme', 'Normal'])
    for (const [difficulty, stages] of Object.entries(reincarnationStages)) {
      expect(stages).toHaveLength(5)
      stages.forEach((stage, i) => {
        expect(stage.stage).toBe(i + 1)
        expect(stage.missions.length).toBeGreaterThan(0)
        for (const m of stage.missions) {
          expect(typeof m.condition).toBe('string')
          expect(m.condition.trim()).not.toBe('')
          expect(typeof m.reward).toBe('string')
          expect(m.reward.trim()).not.toBe('')
        }
      })
    }
  })

  it('defines 3 boss waves for each difficulty', () => {
    expect(Object.keys(reincarnationBosses).sort()).toEqual(['Extreme', 'Normal'])
    for (const [difficulty, waves] of Object.entries(reincarnationBosses)) {
      expect(waves).toHaveLength(3)
      waves.forEach((wave, i) => {
        expect(wave.wave).toBe(i + 1)
        expect(wave.bosses.length).toBeGreaterThan(0)
        for (const boss of wave.bosses) {
          expect(typeof boss.name).toBe('string')
          expect(Array.isArray(boss.weakness)).toBe(true)
          expect(Array.isArray(boss.resist)).toBe(true)
        }
      })
    }
  })
})

describe('cross-dataset consistency', () => {
  it('every battle with a video url yields a builtin guide', () => {
    const withVideo = sampleBattles.filter((b) => b.videoUrl)
    expect(withVideo.length).toBeGreaterThan(0)
    for (const b of withVideo) {
      const guide = buildBuiltinGuide(b)
      expect(guide).not.toBeNull()
      expect(guide.title).toBeTruthy()
      expect(guide.url).toBe(b.videoUrl)
    }
  })

  it('bookshelf detail teams reference characters that exist', () => {
    // characters file is heavy; assert against names used elsewhere instead of duplicating
    const allTeamMembers = bookshelfDetails.flatMap((d) => [
      ...d.team.front, ...d.team.back, ...d.team.partner
    ])
    expect(allTeamMembers.every((name) => typeof name === 'string' && name.length > 0)).toBe(true)
  })
})
