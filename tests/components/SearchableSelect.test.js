import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchableSelect from '../../src/components/SearchableSelect.vue'

const options = ['阿尔德', '浅见', '桔梗']

function mountSelect(props = {}) {
  return mount(SearchableSelect, {
    props: { options, modelValue: '', ...props },
    attachTo: document.body
  })
}

describe('SearchableSelect', () => {
  it('shows the selected value or falls back to the placeholder', () => {
    const withValue = mountSelect({ modelValue: '阿尔德' })
    expect(withValue.find('.ss-value').text()).toBe('阿尔德')
    expect(withValue.find('.ss-value').classes('placeholder')).toBe(false)

    const empty = mountSelect({ modelValue: '', placeholder: '请选择角色' })
    expect(empty.find('.ss-value').text()).toBe('请选择角色')
    expect(empty.find('.ss-value').classes('placeholder')).toBe(true)
  })

  it('opens and closes the dropdown on control click', async () => {
    const wrapper = mountSelect()
    expect(wrapper.find('.ss-dropdown').exists()).toBe(false)

    await wrapper.find('.ss-control').trigger('click')
    expect(wrapper.find('.ss-dropdown').exists()).toBe(true)
    expect(wrapper.findAll('.ss-option')).toHaveLength(3)

    await wrapper.find('.ss-control').trigger('click')
    expect(wrapper.find('.ss-dropdown').exists()).toBe(false)
  })

  it('filters options while typing', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.ss-control').trigger('click')
    const search = wrapper.find('input.ss-search')
    await search.setValue('桔')
    expect(wrapper.findAll('.ss-option').map((o) => o.text())).toEqual(['桔梗'])
    await search.setValue('')
    expect(wrapper.findAll('.ss-option')).toHaveLength(3)
  })

  it('shows an empty state when no option matches', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.ss-control').trigger('click')
    await wrapper.find('input.ss-search').setValue('不存在')
    expect(wrapper.findAll('.ss-option')).toHaveLength(0)
    expect(wrapper.find('.ss-empty').text()).toBe('无匹配选项')
  })

  it('emits the picked option and closes the dropdown', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.ss-control').trigger('click')
    await wrapper.findAll('.ss-option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['浅见'])
    expect(wrapper.find('.ss-dropdown').exists()).toBe(false)
  })

  it('marks the active option', async () => {
    const wrapper = mountSelect({ modelValue: '桔梗' })
    await wrapper.find('.ss-control').trigger('click')
    const active = wrapper.findAll('.ss-option').filter((o) => o.classes('active'))
    expect(active.map((o) => o.text())).toEqual(['桔梗'])
  })

  it('clears the value via the clear button without toggling the dropdown', async () => {
    const wrapper = mountSelect({ modelValue: '阿尔德' })
    expect(wrapper.find('.ss-clear').exists()).toBe(true)
    await wrapper.find('.ss-clear').trigger('click')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([''])
    expect(wrapper.find('.ss-dropdown').exists()).toBe(false)
  })

  it('closes on Escape and picks the first match on Enter', async () => {
    const esc = mountSelect()
    await esc.find('.ss-control').trigger('click')
    await esc.find('input.ss-search').trigger('keydown.esc')
    expect(esc.find('.ss-dropdown').exists()).toBe(false)

    const enter = mountSelect()
    await enter.find('.ss-control').trigger('click')
    await enter.find('input.ss-search').trigger('keydown.enter')
    expect(enter.emitted('update:modelValue').at(-1)).toEqual(['阿尔德'])
  })

  it('does nothing on Enter when there are no matches', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.ss-control').trigger('click')
    await wrapper.find('input.ss-search').setValue('zzz')
    await wrapper.find('input.ss-search').trigger('keydown.enter')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('closes when clicking outside the component', async () => {
    const wrapper = mountSelect()
    await wrapper.find('.ss-control').trigger('click')
    expect(wrapper.find('.ss-dropdown').exists()).toBe(true)
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.ss-dropdown').exists()).toBe(false)
  })
})
