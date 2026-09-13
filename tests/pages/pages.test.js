import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { sampleCharacters } from '../../src/data/samples/characters.js'
import { defaultNameDisplayMode } from '../../src/data/config.js'
import { setNameDisplayMode } from '../../src/utils/name-display.js'

let homePage
let charactersPage
let detailFound
let detailMissing

beforeAll(async () => {
  // Pages mount their root app onto #app and compile the inline HTML as the
  // root template, so the element must exist before the modules are imported.
  document.body.innerHTML = '<div id="app"></div>'
  vi.spyOn(console, 'warn').mockImplementation(() => {})

  homePage = await import('../../src/main.js')
  charactersPage = await import('../../src/pages/characters/main.js')

  window.history.pushState({}, '', '/character-detail/index.html?id=alde')
  detailFound = await import('../../src/pages/character-detail/main.js?case=found')

  window.history.pushState({}, '', '/character-detail/index.html')
  detailMissing = await import('../../src/pages/character-detail/main.js?case=missing')
})

afterEach(() => {
  vi.unstubAllGlobals()
  setNameDisplayMode(defaultNameDisplayMode)
})

afterAll(() => {
  vi.restoreAllMocks()
})

function mountOptions(appOptions) {
  return mount({ ...appOptions, template: '<div/>' })
}

describe('home page (src/main.js)', () => {
  it('exposes nav items and item counts', () => {
    const wrapper = mountOptions(homePage.appOptions)
    expect(wrapper.vm.navItems).toHaveLength(16)
    expect(wrapper.vm.itemCounts['角色']).toBe(5)
    expect(wrapper.vm.getItemCount('角色')).toBe(5)
    expect(wrapper.vm.getItemCount('不存在的板块')).toBe('')
  })

  it('toggles the sidebar', () => {
    const wrapper = mountOptions(homePage.appOptions)
    const initial = wrapper.vm.sidebarOpen
    wrapper.vm.toggleSidebar()
    expect(wrapper.vm.sidebarOpen).toBe(!initial)
  })
})

describe('characters page (src/pages/characters/main.js)', () => {
  it('exposes all characters and filters them by weapon', () => {
    const wrapper = mountOptions(charactersPage.appOptions)
    expect(wrapper.vm.allData).toHaveLength(sampleCharacters.length)
    expect(wrapper.vm.filteredData).toHaveLength(sampleCharacters.length)

    wrapper.vm.filterWeapon = ['刀']
    expect(wrapper.vm.filteredData.map((c) => c.id)).toEqual(['alde', 'qian'])
  })

  it('combines filters and search query', () => {
    const wrapper = mountOptions(charactersPage.appOptions)
    wrapper.vm.filterWeapon = ['刀']
    wrapper.vm.searchQuery = '水'
    expect(wrapper.vm.filteredData.map((c) => c.id)).toEqual(['qian'])
  })

  it('tracks whether any filter or query is active', () => {
    const wrapper = mountOptions(charactersPage.appOptions)
    expect(wrapper.vm.hasActiveFilters).toBe(false)
    wrapper.vm.searchQuery = '   '
    expect(wrapper.vm.hasActiveFilters).toBe(false)
    wrapper.vm.filterElement = ['火']
    expect(wrapper.vm.hasActiveFilters).toBe(true)
    wrapper.vm.searchQuery = '阿尔德'
    expect(wrapper.vm.hasActiveFilters).toBe(true)
  })

  it('toggles filter values on and off', () => {
    const wrapper = mountOptions(charactersPage.appOptions)
    wrapper.vm.toggleFilter('filterElement', '火')
    expect(wrapper.vm.filterElement).toEqual(['火'])
    wrapper.vm.toggleFilter('filterElement', '风')
    expect(wrapper.vm.filterElement).toEqual(['火', '风'])
    wrapper.vm.toggleFilter('filterElement', '火')
    expect(wrapper.vm.filterElement).toEqual(['风'])
  })

  it('clears every filter and the query at once', () => {
    const wrapper = mountOptions(charactersPage.appOptions)
    wrapper.vm.filterWeapon = ['刀']
    wrapper.vm.filterElement = ['火']
    wrapper.vm.filterForm = ['AS']
    wrapper.vm.filterPersonality = ['龙']
    wrapper.vm.filterLightShadow = ['天']
    wrapper.vm.searchQuery = '阿尔德'

    wrapper.vm.clearFilters()
    expect(wrapper.vm.filterWeapon).toEqual([])
    expect(wrapper.vm.filterElement).toEqual([])
    expect(wrapper.vm.filterForm).toEqual([])
    expect(wrapper.vm.filterPersonality).toEqual([])
    expect(wrapper.vm.filterLightShadow).toEqual([])
    expect(wrapper.vm.searchQuery).toBe('')
    expect(wrapper.vm.filteredData).toHaveLength(sampleCharacters.length)
  })

  it('navigates to the character detail page on row click', () => {
    vi.stubGlobal('location', { href: '' })
    const wrapper = mountOptions(charactersPage.appOptions)
    wrapper.vm.goToDetail({ id: 'alde' })
    expect(window.location.href).toBe('../character-detail/index.html?id=alde')
  })

  it('跟随全局名称显示模式切换列表里的角色名', () => {
    const wrapper = mountOptions(charactersPage.appOptions)
    const nameOf = (id) => wrapper.vm.filteredData.find((c) => c.id === id).name
    const defaultName = nameOf('alde')
    expect(defaultName).toBe('阿尔德')

    setNameDisplayMode('jpName')
    expect(nameOf('alde')).toBe('アルド')
    wrapper.vm.searchQuery = 'アルド'
    expect(wrapper.vm.filteredData.map((c) => c.id)).toEqual(['alde'])

    setNameDisplayMode('cnName')
    expect(nameOf('alde')).toBe('阿鲁多')
    setNameDisplayMode('internationalName')
    expect(nameOf('alde')).toBe('阿尔德')
  })

  it('toggles the sidebar from the initial window size', () => {
    const wrapper = mountOptions(charactersPage.appOptions)
    expect(wrapper.vm.sidebarOpen).toBe(window.innerWidth > 768)
    wrapper.vm.toggleSidebar()
    expect(wrapper.vm.sidebarOpen).toBe(!(window.innerWidth > 768))
  })
})

describe('character detail page (src/pages/character-detail/main.js)', () => {
  it('resolves the character from the id query parameter', () => {
    const wrapper = mountOptions(detailFound.appOptions)
    expect(wrapper.vm.character.id).toBe('alde')
    expect(wrapper.vm.character.name).toBe('阿尔德')
  })

  it('可以在五星与四星立绘之间切换', () => {
    const qian = sampleCharacters.find((c) => c.id === 'qian')
    const wrapper = mount({
      ...detailFound.appOptions,
      template: '<div/>',
      data() { return { ...detailFound.appOptions.data(), character: qian } }
    })
    expect(wrapper.vm.artOptions.map((o) => o.label)).toEqual(['五星立绘', '四星立绘'])
    expect(wrapper.vm.activeArtKey).toBe('fiveStar')
    expect(wrapper.vm.currentArt).toBe(qian.art.fiveStar)

    wrapper.vm.artLevel = 'fourStar'
    expect(wrapper.vm.activeArtKey).toBe('fourStar')
    expect(wrapper.vm.currentArt).toBe(qian.art.fourStar)

    wrapper.vm.artZoomed = true
    expect(wrapper.vm.artZoomed).toBe(true)
  })

  it('没有立绘数据时不显示立绘', () => {
    const withoutArt = mount({
      ...detailFound.appOptions,
      template: '<div/>',
      data() { return { ...detailFound.appOptions.data(), character: { id: 'x', name: '无立绘' } } }
    })
    expect(withoutArt.vm.artOptions).toEqual([])
    expect(withoutArt.vm.currentArt).toBe('')
  })

  it('computes star guide flags and star skills', () => {
    const wrapper = mountOptions(detailFound.appOptions)
    expect(wrapper.vm.hasStarGuide).toBeTruthy()
    expect(wrapper.vm.starSkills).toHaveLength(1)
    expect(wrapper.vm.starSkills[0].name).toBe('星龙斩')
  })

  it('觉醒能力固定三个分类且与天冥值、等级无关', () => {
    const wrapper = mountOptions(detailFound.appOptions)
    const awaken = wrapper.vm.awakenAbilities
    expect(awaken.map((a) => a.category)).toEqual(['天冥能力', '星导爆裂强化', '获得能力'])
    expect(awaken.every((a) => a.initialEffect && a.enhancedEffect)).toBe(true)
    expect(awaken.every((a) => !('unlock' in a))).toBe(true)

    // 天冥奖励是天冥值解锁的独立数据，不再混进觉醒能力
    expect(wrapper.vm.tenmeiRewards).toHaveLength(10)
    expect(wrapper.vm.tenmeiRewards[0].condition).toBe('天值 5')
  })

  it('把觉醒能力整理成图片里的表格行', () => {
    const wrapper = mountOptions(detailFound.appOptions)
    const rows = wrapper.vm.awakenRows

    // 三个分类各两行：初期效果一行、强化效果一行
    expect(rows).toHaveLength(6)
    expect(rows.filter((r) => r.categoryRowspan).map((r) => r.category))
      .toEqual(['天冥能力', '星导爆裂强化', '获得能力'])
    expect(rows.every((r) => r.categoryRowspan === 2 || r.categoryRowspan === null)).toBe(true)
    expect(rows.map((r) => r.enhanced)).toEqual([false, true, false, true, false, true])

    // 每个分类只有一条固定内容，不会再出现多行
    expect(rows.every((r) => r.blocks.length === 1)).toBe(true)
    expect(rows[0].blocks[0].cond).toBe('〈天〉的伙伴3人以上在前卫时发动')
    expect(rows[0].blocks[0].segments).toEqual([
      { text: '战斗中自身行动时，累积的天之力增加（小）', diff: false }
    ])

    // 强化效果里变化的数值标红（20% -> 40%）
    expect(rows[3].blocks[0].segments).toContainEqual({ text: '40%', diff: true })
  })

  it('groups skills by skill type', () => {
    const wrapper = mountOptions(detailFound.appOptions)
    expect(wrapper.vm.getSkillsByType('战斗宣言').map((s) => s.name)).toEqual(['火焰斩', '龙神斩'])
    expect(wrapper.vm.getSkillsByType('固有技能').map((s) => s.name)).toEqual(['守护之誓'])
    expect(wrapper.vm.getSkillsByType('习得技能')).toEqual([])
  })

  it('技能属性统一使用 .tag-* 属性色类名', () => {
    const wrapper = mountOptions(detailFound.appOptions)
    expect(wrapper.vm.getTypeClass('火')).toBe('tag-火')
    expect(wrapper.vm.getTypeClass('地')).toBe('tag-地')
    expect(wrapper.vm.getTypeClass('')).toBe('skill-card-icon--unknown')
    expect(wrapper.vm.getTypeClass(undefined)).toBe('skill-card-icon--unknown')
  })

  it('handles an unknown character id gracefully', () => {
    const wrapper = mountOptions(detailMissing.appOptions)
    expect(wrapper.vm.character).toBeNull()
    expect(wrapper.vm.hasStarGuide).toBeFalsy()
    expect(wrapper.vm.starSkills).toEqual([])
    expect(wrapper.vm.awakenRows).toEqual([])
    expect(wrapper.vm.getSkillsByType('战斗宣言')).toEqual([])
    expect(wrapper.vm.getTypeClass('火')).toBe('tag-火')
  })

  it('toggles the sidebar', () => {
    const wrapper = mountOptions(detailFound.appOptions)
    const initial = wrapper.vm.sidebarOpen
    wrapper.vm.toggleSidebar()
    expect(wrapper.vm.sidebarOpen).toBe(!initial)
  })

  it('handles characters with partial star guide ability data', () => {
    const base = detailFound.appOptions
    const wrapper = mount({
      ...base,
      template: '<div/>',
      data() {
        return {
          ...base.data(),
          character: {
            id: 'custom',
            name: '自定义',
            starGuideAbilities: {
              awaken: [
                { category: '天冥能力', condition: '条件', initialEffect: 'a', enhancedEffect: 'b' }
              ]
            }
          }
        }
      }
    })
    expect(wrapper.vm.hasStarGuide).toBeTruthy()
    expect(wrapper.vm.starSkills).toEqual([])
    const rows = wrapper.vm.awakenRows
    expect(rows).toHaveLength(2)
    expect(rows[0].category).toBe('天冥能力')
    expect(rows[0].blocks[0].cond).toBe('条件')
  })

  it('handles characters without any star guide data', () => {
    const base = detailFound.appOptions
    const mountCustom = (character) => mount({
      ...base,
      template: '<div/>',
      data() {
        return { ...base.data(), character }
      }
    })

    const withoutAbilities = mountCustom({ id: 'c1', name: '无星导' })
    expect(withoutAbilities.vm.hasStarGuide).toBeFalsy()
    expect(withoutAbilities.vm.starSkills).toEqual([])
    expect(withoutAbilities.vm.awakenRows).toEqual([])

    const emptyAbilities = mountCustom({ id: 'c2', name: '空星导', starGuideAbilities: {} })
    expect(emptyAbilities.vm.hasStarGuide).toBeFalsy()
    expect(emptyAbilities.vm.awakenRows).toEqual([])
  })
})
