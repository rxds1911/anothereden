import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { sampleDiary } from '../../src/data/samples/diary.js'
import { createDiaryAppOptions } from '../../src/pages/diary/main.js'

afterEach(() => {
  vi.unstubAllEnvs()
})

function mountDiaryPage(entries = sampleDiary) {
  const options = createDiaryAppOptions({
    loader: async () => ({ entries, source: 'directus', fallbackReason: '' })
  })
  return mount({ ...options, template: '<div />' })
}

describe('diary page data loading', () => {
  it('loads all 74 diary entries from the configured data source', async () => {
    const wrapper = mountDiaryPage()
    await flushPromises()

    expect(wrapper.vm.loading).toBe(false)
    expect(wrapper.vm.loadState).toBe('directus')
    expect(wrapper.vm.filteredData).toHaveLength(74)
    expect(wrapper.vm.filteredData[0]).toMatchObject({
      name: '不愧是火之村落',
      location: '火之村 拉多路',
      era: '古代'
    })
    expect(wrapper.vm.totalPages).toBe(7)
    expect(wrapper.vm.paginatedData).toHaveLength(12)
  })

  it('filters by era and searches both narrative and location', async () => {
    const wrapper = mountDiaryPage()
    await flushPromises()

    wrapper.vm.filterEra = '未来'
    expect(wrapper.vm.filteredData.length).toBeGreaterThan(0)
    expect(wrapper.vm.filteredData.every((entry) => entry.era === '未来')).toBe(true)

    wrapper.vm.filterEra = ''
    wrapper.vm.searchQuery = '蛇骨岛'
    expect(wrapper.vm.filteredData).toHaveLength(3)
  })

  it('filters the imported area values', async () => {
    const wrapper = mountDiaryPage()
    await flushPromises()

    wrapper.vm.filterArea = '冥峡界'
    expect(wrapper.vm.filteredData).toHaveLength(3)
    expect(wrapper.vm.filteredData.every((entry) => entry.area === '冥峡界')).toBe(true)
  })

  it('paginates entries and resets to page one after filtering', async () => {
    const wrapper = mountDiaryPage()
    await flushPromises()

    wrapper.vm.currentPage = 2
    expect(wrapper.vm.paginatedData[0].slug).toBe('cat-diary-013')

    wrapper.vm.filterArea = '冥峡界'
    await nextTick()
    expect(wrapper.vm.currentPage).toBe(1)
    expect(wrapper.vm.totalPages).toBe(1)
    expect(wrapper.vm.paginatedData).toHaveLength(3)
  })

  it('renders one page of cards with pagination controls', async () => {
    vi.stubEnv('VITE_DIRECTUS_URL', '')
    const html = readFileSync(resolve(process.cwd(), 'src/pages/diary/index.html'), 'utf8')
    const appStart = html.indexOf('<div id="app">')
    const scriptStart = html.indexOf('<script type="module"', appStart)
    document.body.innerHTML = html.slice(appStart, scriptStart).trim()

    await import('../../src/pages/diary/main.js?render-test')
    await flushPromises()
    await nextTick()

    expect(document.querySelectorAll('.char-card')).toHaveLength(12)
    expect(document.querySelector('.char-page-count').textContent.replace(/\s+/g, ' ').trim())
      .toBe('共 74 篇日记')
    expect([...document.querySelectorAll('.generic-card-label')].some((label) => label.textContent.trim() === '地点'))
      .toBe(true)
    expect(document.querySelector('.pagination')).not.toBeNull()
    expect(document.querySelectorAll('.pagination-page-btn')).toHaveLength(7)
    expect(document.querySelector('[aria-current="page"]').textContent.trim()).toBe('1')
  })
})
