import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import GuideSection from '../src/components/GuideSection.vue'
import { sampleBattles } from '../src/data/samples/battle.js'

// Mirrors how src/pages/battle-detail/index.html wires GuideSection.
const battle = sampleBattles.find((b) => b.id === 6)
const pageProps = {
  itemId: String(battle.id),
  itemName: battle.name,
  builtinGuide: battle.videoUrl ? battle : null,
  builtinGuides: [],
  vows: []
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

async function mountPage() {
  const wrapper = mount(GuideSection, { props: pageProps })
  await flushPromises()
  return wrapper
}

async function submitGuide(wrapper, { title, url }) {
  const inputs = wrapper.findAll('.guide-form-input')
  await inputs[0].setValue(title)
  await inputs[1].setValue(url)
  await wrapper.find('.guide-submit').trigger('click')
}

describe('上传攻略视频（battle-detail 页面装配方式）', () => {
  it('渲染内置攻略：标题、内置徽章、观看链接与队伍', async () => {
    const wrapper = await mountPage()
    expect(wrapper.text()).toContain('星幽霸主 无续关攻略')
    expect(wrapper.text()).toContain('内置')
    expect(wrapper.find('.guide-watch').attributes('href')).toBe(battle.videoUrl)
    expect(wrapper.text()).toContain('阿尔德')
    expect(wrapper.text()).toContain('共 1 篇')
  })

  it('校验失败时不写入 localStorage', async () => {
    const wrapper = await mountPage()
    await wrapper.find('.guide-header-btn').trigger('click')

    await submitGuide(wrapper, { title: '', url: 'https://example.com/not-bili' })
    expect(wrapper.find('.guide-form-msg').text()).toContain('请填写有效的 B 站视频链接')

    await submitGuide(wrapper, {
      title: '标题',
      url: 'https://www.bilibili.com/video/BV1GJ411x7y7'
    })
    expect(wrapper.find('.guide-form-msg').text()).toBe('请至少选择 1 名前排角色')

    expect(localStorage.getItem('anothereden.battleGuides.6')).toBeNull()
  })

  it('完整投稿：选前排角色 → 提交 → 持久化并展示，表单关闭', async () => {
    const wrapper = await mountPage()
    await wrapper.find('.guide-header-btn').trigger('click')

    // 通过下拉 UI 选择前排角色（模拟真实操作）
    await wrapper.findAll('.guide-form .ss-control')[0].trigger('click')
    await wrapper.findAll('.guide-form .ss-option')[0].trigger('click')
    expect(wrapper.vm.form.front[0]).toBe('阿尔德')

    await submitGuide(wrapper, {
      title: '我的速通攻略',
      url: 'https://www.bilibili.com/video/BV1GJ411x7y7'
    })

    const stored = JSON.parse(localStorage.getItem('anothereden.battleGuides.6'))
    expect(stored).toHaveLength(1)
    expect(stored[0].title).toBe('我的速通攻略')
    expect(stored[0].source).toBe('user')
    expect(stored[0].team.front).toEqual(['阿尔德'])

    expect(wrapper.text()).toContain('我的速通攻略')
    expect(wrapper.text()).toContain('用户投稿')
    expect(wrapper.text()).toContain('共 2 篇')
    expect(wrapper.find('.guide-form').exists()).toBe(false)
  })

  it('刷新页面（重新挂载）后用户攻略仍在，且排在内置攻略之前', async () => {
    localStorage.setItem(
      'anothereden.battleGuides.6',
      JSON.stringify([
        {
          id: 'user-1',
          title: '之前的投稿',
          url: 'https://www.bilibili.com/video/BV1GJ411x7y7',
          team: { front: ['阿尔德'], back: [], partner: [] },
          vows: [],
          source: 'user',
          createdAt: new Date().toISOString()
        }
      ])
    )
    const wrapper = await mountPage()
    const titles = wrapper.findAll('.guide-title').map((n) => n.text())
    expect(titles[0]).toContain('之前的投稿')
    expect(titles[1]).toContain('星幽霸主 无续关攻略')
    expect(wrapper.text()).toContain('用户投稿')
  })

  it('删除用户攻略需确认，确认后从 localStorage 移除', async () => {
    localStorage.setItem(
      'anothereden.battleGuides.6',
      JSON.stringify([
        {
          id: 'user-1',
          title: '要删除的投稿',
          url: 'https://www.bilibili.com/video/BV1GJ411x7y7',
          team: { front: ['阿尔德'], back: [], partner: [] },
          source: 'user',
          createdAt: new Date().toISOString()
        }
      ])
    )
    const wrapper = await mountPage()

    confirm.mockReturnValueOnce(false)
    await wrapper.find('.guide-delete').trigger('click')
    expect(wrapper.text()).toContain('要删除的投稿')

    await wrapper.find('.guide-delete').trigger('click')
    expect(wrapper.text()).not.toContain('要删除的投稿')
    expect(JSON.parse(localStorage.getItem('anothereden.battleGuides.6'))).toEqual([])
  })

  it('自动获取标题成功时回填标题', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ code: 0, data: { title: '自动标题' } }) })
    ))
    const wrapper = await mountPage()
    await wrapper.find('.guide-header-btn').trigger('click')
    await wrapper.findAll('.guide-form-input')[1].setValue('https://www.bilibili.com/video/BV1GJ411x7y7')
    await wrapper.find('.guide-title-btn').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('.guide-form-input')[0].element.value).toBe('自动标题')
    expect(wrapper.find('.guide-form-title-hint').classes('guide-form-title-hint--ok')).toBe(true)
  })
})
