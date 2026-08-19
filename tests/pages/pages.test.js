import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { sampleCharacters } from '../../src/data/samples/characters.js'

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

  it('computes star guide flags and star skills', () => {
    const wrapper = mountOptions(detailFound.appOptions)
    expect(wrapper.vm.hasStarGuide).toBeTruthy()
    expect(wrapper.vm.starSkills).toHaveLength(1)
    expect(wrapper.vm.starSkills[0].name).toBe('星龙斩')
  })

  it('merges star guide abilities into categorized rows', () => {
    const wrapper = mountOptions(detailFound.appOptions)
    const merged = wrapper.vm.mergedStarAbilities
    expect(merged).toHaveLength(15)
    expect(merged.slice(0, 10).every((x) => x.category === '天冥能力')).toBe(true)
    expect(merged[0].cond).toBe('天值 5')
    expect(merged[10].category).toBe('星导爆裂强化')
    expect(merged[11].category).toBe('获得能力')
    expect(merged[11].cond).toBe('Lv.50')
  })

  it('groups skills by skill type', () => {
    const wrapper = mountOptions(detailFound.appOptions)
    expect(wrapper.vm.getSkillsByType('战斗宣言').map((s) => s.name)).toEqual(['火焰斩', '龙神斩'])
    expect(wrapper.vm.getSkillsByType('固有技能').map((s) => s.name)).toEqual(['守护之誓'])
    expect(wrapper.vm.getSkillsByType('习得技能')).toEqual([])
  })

  it('maps element types to colors with a fallback', () => {
    const wrapper = mountOptions(detailFound.appOptions)
    expect(wrapper.vm.getTypeColor('火')).toBe('#e74c3c')
    expect(wrapper.vm.getTypeColor('水')).toBe('#3498db')
    expect(wrapper.vm.getTypeColor('未知')).toBe('#888')
  })

  it('handles an unknown character id gracefully', () => {
    const wrapper = mountOptions(detailMissing.appOptions)
    expect(wrapper.vm.character).toBeNull()
    expect(wrapper.vm.hasStarGuide).toBeFalsy()
    expect(wrapper.vm.starSkills).toEqual([])
    expect(wrapper.vm.mergedStarAbilities).toEqual([])
    expect(wrapper.vm.getSkillsByType('战斗宣言')).toEqual([])
    expect(wrapper.vm.getTypeColor('火')).toBe('#e74c3c')
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
              abilityGain: [
                { name: '能力', unlock: 'Lv.50', initialEffect: 'a', enhancedEffect: 'b' },
                { name: '无条件能力', initialEffect: 'c', enhancedEffect: 'd' }
              ]
            }
          }
        }
      }
    })
    expect(wrapper.vm.hasStarGuide).toBeTruthy()
    expect(wrapper.vm.starSkills).toEqual([])
    const merged = wrapper.vm.mergedStarAbilities
    expect(merged).toHaveLength(2)
    expect(merged[0].category).toBe('获得能力')
    expect(merged[0].cond).toBe('Lv.50')
    expect(merged[1].cond).toBe('')
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
    expect(withoutAbilities.vm.mergedStarAbilities).toEqual([])

    const emptyAbilities = mountCustom({ id: 'c2', name: '空星导', starGuideAbilities: {} })
    expect(emptyAbilities.vm.hasStarGuide).toBeFalsy()
    expect(emptyAbilities.vm.mergedStarAbilities).toEqual([])
  })
})
