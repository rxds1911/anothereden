import { describe, expect, it, vi } from 'vitest'
import { sampleDiary } from '../src/data/samples/diary.js'
import {
  buildDiaryRequestUrl,
  fetchDiaryEntriesFromDirectus,
  loadDiaryEntries,
  mapDiaryRow
} from '../src/services/diary-content.js'

describe('diary content service', () => {
  it('maps Directus snake_case fields into the existing card shape', () => {
    expect(mapDiaryRow({
      id: 12,
      slug: 'cat-diary-012',
      narrative: '测试叙述',
      location: '测试地点',
      area: '席尔贝利亚大陆',
      era: '古代',
      sort: 12
    })).toEqual({
      id: 12,
      slug: 'cat-diary-012',
      name: '测试叙述',
      location: '测试地点',
      area: '席尔贝利亚大陆',
      era: '古代',
      sort: 12
    })
  })

  it('fills deterministic defaults for missing or invalid Directus fields', () => {
    expect(mapDiaryRow({
      id: 9,
      name: '旧字段名称',
      sort: 'not-a-number',
      narrative: '  旧字段叙述  '
    }, 2)).toEqual({
      id: 9,
      slug: 'cat-diary-003',
      name: '旧字段叙述',
      location: '',
      area: '',
      era: '',
      sort: 3
    })
    expect(mapDiaryRow({ id: 10, name: '  备用名称  ', sort: '12' }, 0)).toMatchObject({
      slug: 'cat-diary-012',
      name: '备用名称',
      sort: 12
    })
  })

  it('builds a published diary query with a stable sort order', () => {
    const url = buildDiaryRequestUrl('https://content.example.com/')
    expect(url.pathname).toBe('/items/diary_entries')
    expect(url.searchParams.get('filter[status][_eq]')).toBe('published')
    expect(url.searchParams.get('fields')).toContain('area')
    expect(url.searchParams.get('sort')).toBe('sort')
    expect(url.searchParams.get('limit')).toBe('-1')
  })

  it('loads and filters malformed rows returned by Directus', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          { id: 1, narrative: '有效记录', location: '地点', era: '现代', sort: 1 },
          { id: 2, narrative: '', location: '地点', era: '现代', sort: 2 }
        ]
      })
    })

    const entries = await fetchDiaryEntriesFromDirectus('https://content.example.com', { fetchImpl })
    expect(fetchImpl).toHaveBeenCalledOnce()
    expect(entries).toHaveLength(1)
    expect(entries[0].name).toBe('有效记录')
  })

  it('rejects malformed Directus payloads instead of treating them as empty data', async () => {
    const missingData = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({})
    })
    await expect(fetchDiaryEntriesFromDirectus(
      'https://content.example.com',
      { fetchImpl: missingData }
    )).rejects.toThrow('does not contain a data array')

    const nonArrayData = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => null
    })
    await expect(fetchDiaryEntriesFromDirectus(
      'https://content.example.com',
      { fetchImpl: nonArrayData }
    )).rejects.toThrow('does not contain a data array')
  })

  it('uses the global fetch implementation when no override is supplied', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] })
    })
    vi.stubGlobal('fetch', fetchMock)
    const entries = await fetchDiaryEntriesFromDirectus('https://content.example.com')
    expect(entries).toEqual([])
    expect(fetchMock).toHaveBeenCalledOnce()
    vi.unstubAllGlobals()
  })

  it('returns a Directus result when the remote request succeeds', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [{ id: 1, narrative: '远程记录', location: '地点', era: '未来' }]
      })
    })
    const result = await loadDiaryEntries({
      baseUrl: 'https://content.example.com',
      fetchImpl
    })
    expect(result.source).toBe('directus')
    expect(result.entries).toHaveLength(1)
    expect(result.fallbackReason).toBe('')
  })

  it('uses the bundled snapshot when no Directus URL is configured', async () => {
    const result = await loadDiaryEntries({ env: {} })
    expect(result.source).toBe('static')
    expect(result.entries).toBe(sampleDiary)
  })

  it('falls back to the snapshot when Directus is unavailable', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 503 })
    const result = await loadDiaryEntries({
      baseUrl: 'https://content.example.com',
      fetchImpl
    })

    expect(result.source).toBe('fallback')
    expect(result.entries).toBe(sampleDiary)
    expect(result.fallbackReason).toContain('503')
  })

  it('rethrows abort errors so callers can distinguish cancellation', async () => {
    const abortError = new Error('cancelled')
    abortError.name = 'AbortError'
    await expect(loadDiaryEntries({
      baseUrl: 'https://content.example.com',
      fetchImpl: vi.fn().mockRejectedValue(abortError)
    })).rejects.toBe(abortError)
  })

  it('uses a stable fallback reason for non-Error failures', async () => {
    const result = await loadDiaryEntries({
      baseUrl: 'https://content.example.com',
      fetchImpl: vi.fn().mockRejectedValue('offline')
    })
    expect(result.source).toBe('fallback')
    expect(result.fallbackReason).toBe('Directus request failed')
  })
})
