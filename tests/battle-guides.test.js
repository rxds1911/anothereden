import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildBuiltinGuide,
  isValidBilibiliUrl,
  loadUserGuides,
  saveUserGuides
} from '../src/data/battle-guides.js'

function createStorage(overrides = {}) {
  const store = new Map()
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
    ...overrides
  }
}

let storage

beforeEach(() => {
  storage = createStorage()
  vi.stubGlobal('localStorage', storage)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('isValidBilibiliUrl', () => {
  it('rejects empty, blank or nullish values', () => {
    expect(isValidBilibiliUrl('')).toBe(false)
    expect(isValidBilibiliUrl('   ')).toBe(false)
    expect(isValidBilibiliUrl(null)).toBe(false)
    expect(isValidBilibiliUrl(undefined)).toBe(false)
  })

  it('accepts bilibili.com pages, players and subdomains', () => {
    expect(isValidBilibiliUrl('https://www.bilibili.com/video/BV1GJ411x7y7')).toBe(true)
    expect(isValidBilibiliUrl('https://player.bilibili.com/player.html?bvid=BV1GJ411x7y7')).toBe(true)
    expect(isValidBilibiliUrl('https://space.bilibili.com/12345')).toBe(true)
    expect(isValidBilibiliUrl('bilibili.com/video/BV1GJ411x7y7')).toBe(true)
  })

  it('accepts b23.tv short links with or without scheme', () => {
    expect(isValidBilibiliUrl('https://b23.tv/abc123')).toBe(true)
    expect(isValidBilibiliUrl('https://www.b23.tv/xyz')).toBe(true)
    expect(isValidBilibiliUrl('b23.tv/abc')).toBe(true)
  })

  it('rejects unrelated hosts, including lookalikes', () => {
    expect(isValidBilibiliUrl('https://example.com/watch?v=1')).toBe(false)
    expect(isValidBilibiliUrl('https://youtube.com/watch?v=1')).toBe(false)
    expect(isValidBilibiliUrl('https://evilbilibili.com/x')).toBe(false)
    expect(isValidBilibiliUrl('https://bilibili.com.evil.com/x')).toBe(false)
  })

  it('falls back to a regex when the url cannot be parsed', () => {
    // unparseable host (spaces) but the text mentions bilibili.com
    expect(isValidBilibiliUrl('some text with bilibili.com inside')).toBe(true)
    expect(isValidBilibiliUrl('not a url at all')).toBe(false)
  })
})

describe('buildBuiltinGuide', () => {
  it('returns null for missing battles or battles without a video url', () => {
    expect(buildBuiltinGuide(null)).toBeNull()
    expect(buildBuiltinGuide(undefined)).toBeNull()
    expect(buildBuiltinGuide({ id: 1, name: 'BOSS' })).toBeNull()
  })

  it('uses videoTitle when available', () => {
    const guide = buildBuiltinGuide({
      id: 'boss-1',
      name: '星幽霸主',
      videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7y7',
      videoTitle: '无续关攻略',
      team: { front: ['阿尔德'], back: [], partner: [] }
    })
    expect(guide).toEqual({
      id: 'builtin-boss-1',
      title: '无续关攻略',
      url: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7y7',
      team: { front: ['阿尔德'], back: [], partner: [] },
      source: 'builtin',
      createdAt: ''
    })
  })

  it('falls back to a name-based title and default team', () => {
    const guide = buildBuiltinGuide({ id: 7, name: '时空间谍', videoUrl: 'https://b23.tv/abc' })
    expect(guide.title).toBe('「时空间谍」示例攻略')
    expect(guide.team).toEqual({ front: [], back: [], partner: [] })
  })
})

describe('loadUserGuides / saveUserGuides', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(loadUserGuides('battle-1')).toEqual([])
  })

  it('round-trips saved guides under a prefixed storage key', () => {
    saveUserGuides('battle-1', [
      { id: 'user-1', title: '测试攻略', team: { front: ['阿尔德'], back: [], partner: [] } }
    ])
    expect(storage.getItem('anothereden.battleGuides.battle-1')).toContain('测试攻略')
    expect(loadUserGuides('battle-1')[0].title).toBe('测试攻略')
  })

  it('uses independent storage per battle id', () => {
    saveUserGuides('battle-1', [{ id: 'u1' }])
    expect(loadUserGuides('battle-2')).toEqual([])
  })

  it('sanitizes stored teams and drops falsy members', () => {
    storage.setItem('anothereden.battleGuides.battle-3', JSON.stringify([
      {
        id: 'u2',
        title: '脏数据',
        team: { front: ['阿尔德', '', null, 0], back: 'not-an-array', partner: undefined }
      }
    ]))
    const [guide] = loadUserGuides('battle-3')
    expect(guide.team.front).toEqual(['阿尔德'])
    expect(guide.team.back).toEqual([])
    expect(guide.team.partner).toEqual([])
  })

  it('defaults the team when a stored guide has none', () => {
    storage.setItem('anothereden.battleGuides.battle-8', JSON.stringify([{ id: 'u3', title: '无队伍' }]))
    expect(loadUserGuides('battle-8')[0].team).toEqual({ front: [], back: [], partner: [] })
  })

  it('returns an empty list for non-array stored values', () => {
    storage.setItem('anothereden.battleGuides.battle-4', JSON.stringify({ not: 'a list' }))
    expect(loadUserGuides('battle-4')).toEqual([])
  })

  it('recovers from corrupted JSON and reports the error', () => {
    storage.setItem('anothereden.battleGuides.battle-5', '{broken json')
    expect(loadUserGuides('battle-5')).toEqual([])
    expect(console.error).toHaveBeenCalled()
  })

  it('recovers when localStorage read throws', () => {
    const throwing = createStorage({
      getItem: () => {
        throw new Error('denied')
      }
    })
    vi.stubGlobal('localStorage', throwing)
    expect(loadUserGuides('battle-6')).toEqual([])
    expect(console.error).toHaveBeenCalled()
  })

  it('does not throw when localStorage write fails', () => {
    const throwing = createStorage({
      setItem: () => {
        throw new Error('quota exceeded')
      }
    })
    vi.stubGlobal('localStorage', throwing)
    expect(() => saveUserGuides('battle-7', [{ id: 'u1' }])).not.toThrow()
    expect(console.error).toHaveBeenCalled()
  })
})
