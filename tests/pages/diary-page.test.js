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

    wrapper.vm.currentPage = 2
    wrapper.vm.filterEra = '未来'
    await nextTick()
    expect(wrapper.vm.currentPage).toBe(1)
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

  it('toggles the sidebar and aborts a pending load when the page unmounts', async () => {
    let loadSignal
    const options = createDiaryAppOptions({
      loader: ({ signal }) => new Promise((resolve, reject) => {
        loadSignal = signal
        signal.addEventListener('abort', () => {
          const error = new Error('aborted')
          error.name = 'AbortError'
          reject(error)
        })
      })
    })
    const wrapper = mount({ ...options, template: '<div />' })
    await nextTick()

    const initial = wrapper.vm.sidebarOpen
    wrapper.vm.toggleSidebar()
    expect(wrapper.vm.sidebarOpen).toBe(!initial)

    wrapper.unmount()
    expect(loadSignal.aborted).toBe(true)
    await flushPromises()
  })

  it('rethrows non-abort loader failures but still clears the loading state', async () => {
    const options = createDiaryAppOptions({
      loader: async () => {
        throw new Error('fatal loader error')
      }
    })
    const context = {
      abortController: null,
      diaryEntries: [],
      loadState: 'loading',
      loading: true
    }

    await expect(options.methods.loadEntries.call(context)).rejects.toThrow('fatal loader error')
    expect(context.loading).toBe(false)
  })

  it('renders one page of cards with pagination controls', async () => {
    vi.stubEnv('VITE_DIRECTUS_URL', '')
    const html = readFileSync(resolve(process.cwd(), 'src/pages/diary/index.html'), 'utf8')
    const appStart = html.indexOf('<div id="app">')
    const scriptStart = html.indexOf('<script type="module"', appStart)
    const template = html.slice(appStart, scriptStart).trim()
    document.body.innerHTML = '<div></div>'

    vi.resetModules()
    const page = await import('../../src/pages/diary/main.js?render-test')
    document.body.innerHTML = template
    const app = page.mountDiaryApp(page.createDiaryAppOptions({
      loader: async () => ({ entries: sampleDiary, source: 'directus', fallbackReason: '' })
    }))
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
    app.unmount()
  })

  it('auto-mounts when the page provides an app root', async () => {
    vi.stubEnv('VITE_DIRECTUS_URL', '')
    const html = readFileSync(resolve(process.cwd(), 'src/pages/diary/index.html'), 'utf8')
    const appStart = html.indexOf('<div id="app">')
    const scriptStart = html.indexOf('<script type="module"', appStart)
    document.body.innerHTML = html.slice(appStart, scriptStart).trim()

    vi.resetModules()
    await import('../../src/pages/diary/main.js')
    await flushPromises()
    await nextTick()

    expect(document.querySelectorAll('.char-card')).toHaveLength(12)
    expect(document.querySelector('.char-page-count').textContent.replace(/\s+/g, ' ').trim())
      .toBe('共 74 篇日记')
  })

  it('does not mount when the page has no app root', async () => {
    document.body.innerHTML = '<main id="other-root">未挂载</main>'
    vi.resetModules()
    const page = await import('../../src/pages/diary/main.js')
    expect(page.bootstrapDiaryPage()).toBeNull()
    expect(document.querySelector('#app')).toBeNull()
    expect(document.body.textContent).toContain('未挂载')
  })
})
