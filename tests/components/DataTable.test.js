import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DataTable from '../../src/components/DataTable.vue'

const genericColumns = [
  { key: 'name', label: '名称', sortable: true },
  { key: 'type', label: '类型' },
  { key: 'atk', label: '攻击' }
]

describe('DataTable', () => {
  it('renders the empty state when there is no data', () => {
    const wrapper = mount(DataTable, {
      props: { columns: genericColumns, data: [], emptyText: '空空如也' }
    })
    expect(wrapper.find('.char-list-empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('空空如也')
    expect(wrapper.text()).toContain('试试调整筛选条件或搜索关键词')
  })

  it('renders generic cards and emits row-click', async () => {
    const row = { id: 1, name: '星云之杖', type: '杖', atk: 55 }
    const wrapper = mount(DataTable, { props: { columns: genericColumns, data: [row] } })
    const card = wrapper.find('.char-card')
    expect(card.exists()).toBe(true)
    expect(card.text()).toContain('#1 星云之杖')
    expect(card.text()).toContain('杖')
    expect(card.text()).toContain('55')

    await card.trigger('click')
    expect(wrapper.emitted('row-click')[0][0]).toEqual(row)
  })

  it('keys rows without an id by their index in both card modes', () => {
    const generic = mount(DataTable, {
      props: { columns: genericColumns, data: [{ name: 'A' }, { name: 'B' }] }
    })
    expect(generic.findAll('.char-card')).toHaveLength(2)

    const character = mount(DataTable, {
      props: {
        columns: genericColumns,
        data: [{ name: 'C', personality: ['x'] }, { name: 'D', personality: ['y'] }]
      }
    })
    expect(character.findAll('.char-card')).toHaveLength(2)
  })

  it('hides the numeric id prefix when showId is false', () => {
    const wrapper = mount(DataTable, {
      props: { columns: genericColumns, data: [{ id: 1, name: '星云之杖' }], showId: false }
    })
    expect(wrapper.text()).toContain('星云之杖')
    expect(wrapper.text()).not.toContain('#1')
  })

  it('uses icon, avatarKey or showId as the avatar content', () => {
    const withIcon = mount(DataTable, {
      props: { columns: genericColumns, data: [{ id: 2, name: 'BOSS', icon: '👑' }] }
    })
    expect(withIcon.find('.char-card-avatar').text()).toBe('👑')

    const withId = mount(DataTable, {
      props: { columns: genericColumns, data: [{ id: 3, name: 'BOSS' }], showId: true, avatarKey: 'type' }
    })
    expect(withId.find('.char-card-avatar').text()).toBe('#3')
  })

  it('renders badges for badgeKey, difficulty and hidden bosses', () => {
    const row = {
      id: 6,
      name: '星幽霸主',
      eventType: '外史',
      difficulty: 'Very Hard',
      difficulties: ['Hard', 'Extreme'],
      character: '阿尔德',
      isHiddenBoss: true,
      taskCategory: '外典'
    }
    const wrapper = mount(DataTable, {
      props: { columns: [{ key: 'name', label: '名称' }], data: [row], badgeKey: 'eventType' }
    })
    expect(wrapper.find('.event-type-badge').text()).toBe('外史')
    expect(wrapper.find('.difficulty-badge--very-hard').exists()).toBe(true)
    expect(wrapper.findAll('.difficulty-badge')).toHaveLength(3)
    expect(wrapper.text()).toContain('隐王')
    expect(wrapper.text()).toContain('阿尔德')
    expect(wrapper.text()).toContain('外典')
  })

  it('renders detail rows with formatting, tags and ls splits', () => {
    const columns = [
      { key: 'name', label: '名称' },
      { key: 'atk', label: '攻击', format: (v) => v + '!' },
      { key: 'effects', label: '效果', tag: true },
      { key: 'ls', label: '天冥', ls: true },
      { key: 'empty', label: '空值' }
    ]
    const wrapper = mount(DataTable, {
      props: {
        columns,
        data: [{ id: 1, name: '武器', atk: 100, effects: '火、水,雷', ls: '天冥', empty: '' }]
      }
    })
    const labels = wrapper.findAll('.generic-card-label').map((n) => n.text())
    expect(labels).toEqual(['攻击', '效果', '天冥'])
    expect(wrapper.text()).toContain('100!')
    expect(wrapper.findAll('.generic-card-value.tags-value .tag').map((t) => t.text())).toEqual(['火', '水', '雷'])
    expect(wrapper.findAll('.ls-icon').map((i) => i.text())).toEqual(['天', '冥'])
  })

  it('marks the last detail row as full in two-column mode with odd counts', () => {
    const wrapper = mount(DataTable, {
      props: {
        twoColumnDetail: true,
        columns: [
          { key: 'name', label: '名称' },
          { key: 'a', label: 'A' },
          { key: 'b', label: 'B' },
          { key: 'c', label: 'C' }
        ],
        data: [{ id: 1, name: 'x', a: 1, b: 2, c: 3 }]
      }
    })
    const rows = wrapper.findAll('.generic-card-row')
    expect(rows).toHaveLength(3)
    expect(rows[2].classes('generic-card-row--full')).toBe(true)
  })

  it('switches to character cards when rows have personality', async () => {
    const row = {
      id: 'alde',
      name: '阿尔德',
      element: '火',
      weapon: '刀',
      form: 'NS',
      lightShadow: '天',
      personality: ['主人公', '龙', 'a', 'b', 'c']
    }
    const wrapper = mount(DataTable, { props: { columns: genericColumns, data: [row] } })
    const card = wrapper.find('.char-card')
    expect(card.find('.char-card-avatar').text()).toBe('阿')
    expect(card.text()).toContain('阿尔德')
    expect(card.find('.char-card-form').text()).toBe('NS')
    expect(card.find('.tag-火').text()).toBe('火')
    expect(card.find('.tag-weapon').text()).toBe('刀')
    expect(card.find('.ls-icon--天').text()).toBe('天')
    expect(card.findAll('.char-card-pers')).toHaveLength(4)
    expect(card.find('.char-card-pers-more').text()).toBe('+1')

    await card.trigger('click')
    expect(wrapper.emitted('row-click')[0][0]).toEqual(row)
  })

  it('falls back gracefully for incomplete character rows', () => {
    const wrapper = mount(DataTable, {
      props: {
        columns: genericColumns,
        data: [{ id: 'x', personality: [] }]
      }
    })
    const card = wrapper.find('.char-card')
    expect(card.find('.char-card-avatar').text()).toBe('?')
    expect(card.find('.char-card-form').text()).toBe('-')
    expect(card.find('.char-card-pers').exists()).toBe(false)
    expect(card.find('.char-card-pers-more').exists()).toBe(false)
  })

  it('sorts ascending and descending by sortKey', () => {
    const data = [
      { id: 1, name: 'b' },
      { id: 2, name: 'a' },
      { id: 3, name: 'c' }
    ]
    const asc = mount(DataTable, {
      props: { columns: genericColumns, data, sortKey: 'name', sortDir: 'asc', showId: false }
    })
    expect(asc.findAll('.char-card-name').map((n) => n.text())).toEqual(['a', 'b', 'c'])

    const desc = mount(DataTable, {
      props: { columns: genericColumns, data, sortKey: 'name', sortDir: 'desc', showId: false }
    })
    expect(desc.findAll('.char-card-name').map((n) => n.text())).toEqual(['c', 'b', 'a'])
  })

  it('sorts rows that are missing the sort field', () => {
    const data = [
      { id: 1, name: 'b' },
      { id: 2 },
      { id: 3, name: 'a' }
    ]
    const asc = mount(DataTable, {
      props: { columns: genericColumns, data, sortKey: 'name', sortDir: 'asc', showId: false }
    })
    expect(asc.findAll('.char-card-name').map((n) => n.text())).toEqual(['', 'a', 'b'])
  })

  it('keeps the original order when no sort key is set', () => {
    const data = [
      { id: 1, name: 'b' },
      { id: 2, name: 'a' }
    ]
    const wrapper = mount(DataTable, { props: { columns: genericColumns, data, showId: false } })
    expect(wrapper.findAll('.char-card-name').map((n) => n.text())).toEqual(['b', 'a'])
  })

  it('cycles sort direction on repeated clicks', async () => {
    const wrapper = mount(DataTable, {
      props: { columns: genericColumns, data: [{ id: 1, name: 'a' }] }
    })
    const sortBtn = wrapper.findAll('.sort-btn')[0]

    await sortBtn.trigger('click')
    expect(wrapper.emitted('update:sortKey')).toEqual([['name']])
    expect(wrapper.emitted('update:sortDir')).toEqual([['asc']])

    await wrapper.setProps({ sortKey: 'name', sortDir: 'asc' })
    await sortBtn.trigger('click')
    expect(wrapper.emitted('update:sortDir').at(-1)).toEqual(['desc'])

    await wrapper.setProps({ sortKey: 'name', sortDir: 'desc' })
    await sortBtn.trigger('click')
    expect(wrapper.emitted('update:sortDir').at(-1)).toEqual([''])
    expect(wrapper.emitted('update:sortKey').at(-1)).toEqual([''])
  })

  it('starts ascending when the sort direction is unset for the active key', async () => {
    const wrapper = mount(DataTable, {
      props: { columns: genericColumns, data: [{ id: 1, name: 'a' }], sortKey: 'name', sortDir: '' }
    })
    await wrapper.findAll('.sort-btn')[0].trigger('click')
    expect(wrapper.emitted('update:sortDir')).toEqual([['asc']])
    expect(wrapper.emitted('update:sortKey')).toBeUndefined()
  })

  it('shows the clear-filters button only when filters are active and emits on click', async () => {
    const wrapper = mount(DataTable, {
      props: { columns: genericColumns, data: [{ id: 1, name: 'a' }], hasActiveFilters: false }
    })
    expect(wrapper.find('.sort-clear-all').exists()).toBe(false)

    await wrapper.setProps({ hasActiveFilters: true })
    expect(wrapper.find('.sort-clear-all').exists()).toBe(true)
    await wrapper.find('.sort-clear-all').trigger('click')
    expect(wrapper.emitted('clear-filters')).toHaveLength(1)
  })
})
