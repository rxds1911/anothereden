import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import GuideSection from '../../src/components/GuideSection.vue'

const builtinGuides = [
  {
    title: '星幽霸主 无续关攻略',
    url: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7y7&autoplay=0',
    team: { front: ['阿尔德', '菲奈'], back: ['莉卡'], partner: ['帕蒂'] },
    vows: ['10回合以内']
  }
]

const defaultProps = {
  itemId: 'battle-6',
  itemName: '星幽霸主',
  builtinGuides,
  builtinGuide: null,
  vows: ['10回合以内', '20回合以内']
}

function createStorage() {
  const store = new Map()
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', createStorage())
  vi.stubGlobal('confirm', vi.fn(() => true))
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

async function openForm(wrapper) {
  await wrapper.find('.guide-header-btn').trigger('click')
}

async function fillForm(wrapper, { title = '', url = '' } = {}) {
  const inputs = wrapper.findAll('.guide-form-input')
  await inputs[0].setValue(title)
  await inputs[1].setValue(url)
}

async function mountGuide(props = defaultProps) {
  const wrapper = mount(GuideSection, { props })
  await flushPromises()
  return wrapper
}

describe('GuideSection', () => {
  it('renders builtin guides with badges, team and vows', async () => {
    const wrapper = await mountGuide()
    expect(wrapper.text()).toContain('共 1 篇')
    expect(wrapper.text()).toContain('星幽霸主 无续关攻略')
    expect(wrapper.text()).toContain('内置')
    expect(wrapper.find('.guide-watch').attributes('href')).toBe(builtinGuides[0].url)
    expect(wrapper.text()).toContain('阿尔德')
    expect(wrapper.text()).toContain('莉卡')
    expect(wrapper.text()).toContain('帕蒂')
    expect(wrapper.text()).toContain('✓ 10回合以内')
    expect(wrapper.find('.guide-empty').exists()).toBe(false)
  })

  it('normalizes builtin guides with fallback fields', async () => {
    const wrapper = await mountGuide({
      ...defaultProps,
      builtinGuides: [
        { videoTitle: '来自视频标题', videoUrl: 'https://b23.tv/abc' }
      ],
      builtinGuide: { title: '单篇内置', url: 'https://www.bilibili.com/video/BV1GJ411x7y7' }
    })
    expect(wrapper.text()).toContain('来自视频标题')
    expect(wrapper.text()).toContain('单篇内置')
    expect(wrapper.text()).toContain('共 2 篇')
    expect(wrapper.findAll('.guide-watch').map((a) => a.attributes('href'))).toEqual([
      'https://b23.tv/abc',
      'https://www.bilibili.com/video/BV1GJ411x7y7'
    ])
  })

  it('falls back to a name-based title when a builtin guide has no title fields', async () => {
    const wrapper = await mountGuide({
      ...defaultProps,
      builtinGuides: [{ url: 'https://b23.tv/abc' }]
    })
    expect(wrapper.text()).toContain('「星幽霸主」示例攻略')
  })

  it('treats a non-array builtinGuides prop as empty', async () => {
    const wrapper = await mountGuide({
      ...defaultProps,
      builtinGuides: null,
      builtinGuide: { title: '仅有单篇', url: 'https://b23.tv/abc' }
    })
    expect(wrapper.text()).toContain('仅有单篇')
    expect(wrapper.text()).toContain('共 1 篇')
  })

  it('excludes guides without vows when a vow filter is active', async () => {
    localStorage.setItem(
      'anothereden.battleGuides.battle-6',
      JSON.stringify([
        {
          id: 'user-no-vow',
          title: '没有誓约的攻略',
          url: 'https://www.bilibili.com/video/BV1GJ411x7y7',
          team: { front: ['阿尔德'], back: [], partner: [] },
          source: 'user',
          createdAt: new Date().toISOString()
        }
      ])
    )
    const wrapper = await mountGuide()
    await wrapper.findAll('.filter-chip')[0].trigger('click')
    expect(wrapper.text()).toContain('星幽霸主 无续关攻略')
    expect(wrapper.text()).not.toContain('没有誓约的攻略')
  })

  it('filters guides by query across titles and team members', async () => {
    const wrapper = await mountGuide()
    const search = wrapper.find('.guide-search-input')

    await search.setValue('阿尔德')
    expect(wrapper.text()).toContain('星幽霸主 无续关攻略')

    await search.setValue('不存在的队伍')
    expect(wrapper.find('.guide-empty').text()).toBe('还没有符合条件的攻略，快来投稿第一篇吧～')

    await search.setValue('')
    expect(wrapper.findAll('.guide-item')).toHaveLength(1)
  })

  it('filters guides by vow chips with AND semantics', async () => {
    const wrapper = await mountGuide()
    const chips = wrapper.findAll('.filter-chip')
    expect(chips.map((c) => c.text())).toEqual(['10回合以内', '20回合以内'])

    await chips[0].trigger('click')
    expect(chips[0].classes('active')).toBe(true)
    expect(wrapper.findAll('.guide-item')).toHaveLength(1)

    await chips[1].trigger('click')
    expect(wrapper.findAll('.guide-item')).toHaveLength(0)

    await chips[1].trigger('click')
    expect(wrapper.findAll('.guide-item')).toHaveLength(1)
  })

  it('toggles the submission form and exposes character/partner selectors', async () => {
    const wrapper = await mountGuide()
    expect(wrapper.find('.guide-form').exists()).toBe(false)

    await openForm(wrapper)
    expect(wrapper.find('.guide-form').exists()).toBe(true)
    expect(wrapper.findAll('.guide-form .ss-select')).toHaveLength(8)
    expect(wrapper.text()).toContain('前排至少选择 1 名角色')

    await openForm(wrapper)
    expect(wrapper.find('.guide-form').exists()).toBe(false)
  })

  it('rejects invalid submissions step by step', async () => {
    const wrapper = await mountGuide()
    await openForm(wrapper)

    await wrapper.find('.guide-submit').trigger('click')
    expect(wrapper.find('.guide-form-msg').text()).toContain('请填写有效的 B 站视频链接')

    await fillForm(wrapper, { url: 'https://example.com/video' })
    await wrapper.find('.guide-submit').trigger('click')
    expect(wrapper.find('.guide-form-msg').text()).toContain('请填写有效的 B 站视频链接')

    await fillForm(wrapper, { url: 'https://www.bilibili.com/video/BV1GJ411x7y7' })
    await wrapper.find('.guide-submit').trigger('click')
    expect(wrapper.find('.guide-form-msg').text()).toBe('请填写攻略标题')

    await fillForm(wrapper, { title: '我的攻略', url: 'https://www.bilibili.com/video/BV1GJ411x7y7' })
    await wrapper.find('.guide-submit').trigger('click')
    expect(wrapper.find('.guide-form-msg').text()).toBe('请至少选择 1 名前排角色')
  })

  it('submits a valid guide, persists it and shows it in the list', async () => {
    const wrapper = await mountGuide()
    await openForm(wrapper)
    await fillForm(wrapper, {
      title: '我的攻略',
      url: 'https://www.bilibili.com/video/BV1GJ411x7y7'
    })
    wrapper.vm.form.front[0] = '阿尔德'
    wrapper.vm.form.vows = ['10回合以内']

    await wrapper.find('.guide-submit').trigger('click')

    expect(localStorage.getItem('anothereden.battleGuides.battle-6')).toContain('我的攻略')
    expect(wrapper.text()).toContain('我的攻略')
    expect(wrapper.text()).toContain('用户投稿')
    expect(wrapper.text()).toContain('共 2 篇')
    expect(wrapper.find('.guide-form').exists()).toBe(false)
  })

  it('picks a front character through the searchable select', async () => {
    const wrapper = await mountGuide()
    await openForm(wrapper)
    await wrapper.findAll('.guide-form .ss-control')[0].trigger('click')
    await wrapper.findAll('.guide-form .ss-option')[0].trigger('click')
    expect(wrapper.vm.form.front[0]).toBe('阿尔德')
    expect(wrapper.findAll('.guide-form .ss-value')[0].text()).toBe('阿尔德')
  })

  it('loads persisted user guides on a later mount', async () => {
    localStorage.setItem(
      'anothereden.battleGuides.battle-6',
      JSON.stringify([
        {
          id: 'user-123',
          title: '之前投稿的攻略',
          url: 'https://www.bilibili.com/video/BV1GJ411x7y7',
          team: { front: ['阿尔德'], back: [], partner: [] },
          vows: [],
          source: 'user',
          createdAt: new Date().toISOString()
        }
      ])
    )
    const wrapper = await mountGuide()
    expect(wrapper.text()).toContain('之前投稿的攻略')
    expect(wrapper.text()).toContain('用户投稿')
    expect(wrapper.findAll('.guide-item')).toHaveLength(2)
  })

  it('orders equal-source guides by creation time, newest first', async () => {
    localStorage.setItem(
      'anothereden.battleGuides.battle-6',
      JSON.stringify([
        {
          id: 'user-old',
          title: '较早的攻略',
          url: 'https://www.bilibili.com/video/BV1GJ411x7y7',
          team: { front: ['阿尔德'], back: [], partner: [] },
          source: 'user',
          createdAt: '2026-01-01T00:00:00.000Z'
        },
        {
          id: 'user-new',
          title: '较新的攻略',
          url: 'https://www.bilibili.com/video/BV1GJ411x7y7',
          team: { front: ['菲奈'], back: [], partner: [] },
          source: 'user',
          createdAt: '2026-06-01T00:00:00.000Z'
        }
      ])
    )
    const wrapper = await mountGuide()
    const titles = wrapper.findAll('.guide-title').map((n) => n.text())
    expect(titles[0]).toContain('较新的攻略')
    expect(titles[1]).toContain('较早的攻略')
  })

  it('removes a user guide only after confirmation', async () => {
    localStorage.setItem(
      'anothereden.battleGuides.battle-6',
      JSON.stringify([
        {
          id: 'user-123',
          title: '待删除攻略',
          url: 'https://www.bilibili.com/video/BV1GJ411x7y7',
          team: { front: ['阿尔德'], back: [], partner: [] },
          source: 'user',
          createdAt: new Date().toISOString()
        }
      ])
    )
    const wrapper = await mountGuide()
    expect(wrapper.findAll('.guide-item')).toHaveLength(2)

    confirm.mockReturnValueOnce(false)
    await wrapper.find('.guide-delete').trigger('click')
    expect(wrapper.findAll('.guide-item')).toHaveLength(2)

    await wrapper.find('.guide-delete').trigger('click')
    expect(wrapper.findAll('.guide-item')).toHaveLength(1)
    expect(wrapper.text()).not.toContain('待删除攻略')
    expect(JSON.parse(localStorage.getItem('anothereden.battleGuides.battle-6'))).toHaveLength(0)
  })

  it('hints about invalid or unsupported links in autoFetchTitle', async () => {
    const wrapper = await mountGuide()
    await openForm(wrapper)
    const inputs = wrapper.findAll('.guide-form-input')

    await inputs[1].setValue('https://www.bilibili.com/video/BV123')
    await wrapper.find('.guide-title-btn').trigger('click')
    expect(wrapper.find('.guide-form-title-hint').text()).toContain('无法自动获取标题')
    expect(wrapper.find('.guide-form-title-hint').classes('guide-form-title-hint--error')).toBe(true)

    await inputs[1].setValue('not-a-url')
    await wrapper.find('.guide-title-btn').trigger('click')
    expect(wrapper.find('.guide-form-title-hint').text()).toBe('请先粘贴有效的 B 站视频链接')
  })

  it('auto-fills the title when the api succeeds', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ code: 0, data: { title: '自动获取的标题' } }) })
    ))
    const wrapper = await mountGuide()
    await openForm(wrapper)
    await wrapper.findAll('.guide-form-input')[1].setValue('https://www.bilibili.com/video/BV1GJ411x7y7')
    await wrapper.find('.guide-title-btn').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('.guide-form-input')[0].element.value).toBe('自动获取的标题')
    expect(wrapper.find('.guide-form-title-hint').text()).toContain('已自动填入标题')
    expect(wrapper.find('.guide-form-title-hint').classes('guide-form-title-hint--ok')).toBe(true)
  })

  it('auto-fetches the title when the url input loses focus', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ code: 0, data: { title: '失焦获取' } }) })
    ))
    const wrapper = await mountGuide()
    await openForm(wrapper)
    const urlInput = wrapper.findAll('.guide-form-input')[1]
    await urlInput.setValue('https://www.bilibili.com/video/BV1GJ411x7y7')
    await urlInput.trigger('blur')
    await flushPromises()
    expect(wrapper.findAll('.guide-form-input')[0].element.value).toBe('失焦获取')
  })

  it('keeps an existing title and reports it when the api succeeds', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ code: 0, data: { title: '自动获取的标题' } }) })
    ))
    const wrapper = await mountGuide()
    await openForm(wrapper)
    const inputs = wrapper.findAll('.guide-form-input')
    await inputs[0].setValue('我手写的标题')
    await inputs[1].setValue('https://www.bilibili.com/video/BV1GJ411x7y7')
    await wrapper.find('.guide-title-btn').trigger('click')
    await flushPromises()

    expect(inputs[0].element.value).toBe('我手写的标题')
    expect(wrapper.find('.guide-form-title-hint').text()).toContain('已获取标题：自动获取的标题（未覆盖已填写的标题）')
  })

  it('returns an empty string when formatting an invalid date fails', () => {
    const wrapper = mount(GuideSection, { props: defaultProps })
    vi.spyOn(Date.prototype, 'toLocaleString').mockImplementation(() => {
      throw new Error('boom')
    })
    expect(wrapper.vm.formatDate('2026-01-01')).toBe('')
  })

  it('formats empty dates as an empty string', () => {
    const wrapper = mount(GuideSection, { props: defaultProps })
    expect(wrapper.vm.formatDate('')).toBe('')
    expect(wrapper.vm.formatDate(null)).toBe('')
  })

  it('skips fetching while a previous fetch is still running', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    const wrapper = await mountGuide()
    await openForm(wrapper)
    wrapper.vm.titleFetching = true
    await wrapper.find('.guide-title-btn').trigger('click')
    await flushPromises()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('handles a missing form url in autoFetchTitle', async () => {
    const wrapper = await mountGuide()
    await openForm(wrapper)
    wrapper.vm.form.url = null
    await wrapper.find('.guide-title-btn').trigger('click')
    expect(wrapper.find('.guide-form-title-hint').text()).toBe('请先粘贴有效的 B 站视频链接')
  })

  it('reports failure when the api fails or rejects', async () => {
    const failing = await mountGuide()
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ code: -1 }) })
    ))
    await openForm(failing)
    await failing.findAll('.guide-form-input')[1].setValue('https://www.bilibili.com/video/BV1GJ411x7y7')
    await failing.find('.guide-title-btn').trigger('click')
    await flushPromises()
    expect(failing.find('.guide-form-title-hint').text()).toBe('自动获取标题失败，请手动填写')

    const rejecting = await mountGuide()
    vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network'))))
    await openForm(rejecting)
    await rejecting.findAll('.guide-form-input')[1].setValue('https://www.bilibili.com/video/BV1GJ411x7y7')
    await rejecting.find('.guide-title-btn').trigger('click')
    await flushPromises()
    expect(rejecting.find('.guide-form-title-hint').text()).toBe('自动获取标题失败，请手动填写')
  })

  it('clears form messages when toggling the form', async () => {
    const wrapper = await mountGuide()
    await openForm(wrapper)
    await wrapper.find('.guide-submit').trigger('click')
    expect(wrapper.find('.guide-form-msg').text()).toContain('请填写有效的 B 站视频链接')
    expect(wrapper.find('.guide-form-msg').classes('guide-form-msg--error')).toBe(true)

    await openForm(wrapper)
    await openForm(wrapper)
    expect(wrapper.find('.guide-form-msg').exists()).toBe(false)
    expect(wrapper.find('.guide-form-title-hint').exists()).toBe(false)
  })

  it('renders success-styled form messages', async () => {
    const wrapper = mount(GuideSection, { props: defaultProps })
    wrapper.vm.showGuideForm = true
    wrapper.vm.formMessage = '提交成功'
    wrapper.vm.formError = false
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.guide-form-msg').text()).toBe('提交成功')
    expect(wrapper.find('.guide-form-msg').classes('guide-form-msg--ok')).toBe(true)
  })
})
