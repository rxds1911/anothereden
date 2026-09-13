import { describe, expect, it } from 'vitest'
import { buildAwakenRows, markEnhancedSegments, starAbilityOrder } from '../src/utils/awaken-rows.js'

const abilities = [
  { category: '获得能力', name: '能力解放·攻', condition: 'Lv.60', initialEffect: '物理攻击+15', enhancedEffect: '物理攻击+30' },
  { category: '天冥能力', name: 'HP最大値+100', condition: '天值 5', initialEffect: 'HP上限增加100', enhancedEffect: 'HP上限增加200' },
  { category: '天冥能力', name: '腕力+10', condition: '天值 30', initialEffect: '腕力增加10', enhancedEffect: '腕力增加20' }
]

describe('markEnhancedSegments', () => {
  it('只把强化效果里新出现的数值标为高亮', () => {
    expect(markEnhancedSegments('HP上限增加100', 'HP上限增加200')).toEqual([
      { text: 'HP上限增加', diff: false },
      { text: '200', diff: true }
    ])
  })

  it('数值没变化或没有数值时整段保持普通样式', () => {
    expect(markEnhancedSegments('腕力增加10', '腕力增加10')).toEqual([{ text: '腕力增加10', diff: false }])
    expect(markEnhancedSegments('暴击时伤害UP', '暴击时伤害UP')).toEqual([{ text: '暴击时伤害UP', diff: false }])
    expect(markEnhancedSegments('', '')).toEqual([{ text: '', diff: false }])
  })

  it('识别百分数与多处变化', () => {
    expect(markEnhancedSegments('暴击率提升5%', '暴击率提升8%')).toEqual([
      { text: '暴击率提升', diff: false },
      { text: '8%', diff: true }
    ])
    expect(markEnhancedSegments('10回合', '15回合、速度+30')).toEqual([
      { text: '15', diff: true },
      { text: '回合、速度+', diff: false },
      { text: '30', diff: true }
    ])
  })
})

describe('buildAwakenRows', () => {
  it('每个分类固定两行：初期效果一行 + 强化效果一行', () => {
    const rows = buildAwakenRows(abilities)
    expect(rows).toHaveLength(4)
    expect(rows.map((r) => r.category)).toEqual(['天冥能力', '天冥能力', '获得能力', '获得能力'])
    expect(rows.map((r) => r.enhanced)).toEqual([false, true, false, true])
    expect(rows[0].categoryRowspan).toBe(2)
    expect(rows[1].categoryRowspan).toBeNull()
    expect(rows[2].categoryRowspan).toBe(2)
    expect(rows[3].categoryRowspan).toBeNull()
  })

  it('同一分类下的多条能力合并进同一个单元格', () => {
    const rows = buildAwakenRows(abilities)
    expect(rows[0].blocks.map((b) => b.cond)).toEqual(['天值 5', '天值 30'])
    expect(rows[0].blocks[0].segments).toEqual([{ text: 'HP上限增加100', diff: false }])
    expect(rows[1].blocks.map((b) => b.cond)).toEqual(['天值 5', '天值 30'])
    expect(rows[1].blocks[1].segments).toEqual([
      { text: '腕力增加', diff: false },
      { text: '20', diff: true }
    ])
    expect(rows[2].blocks).toHaveLength(1)
    expect(rows[2].blocks[0].cond).toBe('Lv.60')
  })

  it('分类顺序与 starAbilityOrder 一致，空数据返回空数组', () => {
    expect(starAbilityOrder).toEqual(['天冥能力', '星导爆裂强化', '获得能力'])
    expect(buildAwakenRows([])).toEqual([])
    expect(buildAwakenRows(undefined)).toEqual([])
  })

  it('缺少条件或效果文本时也能渲染', () => {
    const rows = buildAwakenRows([{ category: '天冥能力', name: '无数据' }])
    expect(rows).toHaveLength(2)
    expect(rows[0].blocks).toEqual([{ cond: '', segments: [{ text: '', diff: false }] }])
    expect(rows[1].blocks).toEqual([{ cond: '', segments: [{ text: '', diff: false }] }])
  })
})