import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBar from '../../src/components/SearchBar.vue'

describe('SearchBar', () => {
  it('renders the placeholder and bound value', () => {
    const wrapper = mount(SearchBar, {
      props: { modelValue: '阿尔德', placeholder: '搜索角色' }
    })
    const input = wrapper.find('input.search-input')
    expect(input.attributes('placeholder')).toBe('搜索角色')
    expect(input.element.value).toBe('阿尔德')
  })

  it('emits update:modelValue while typing', async () => {
    const wrapper = mount(SearchBar, { props: { modelValue: '' } })
    await wrapper.find('input.search-input').setValue('阿尔德')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['阿尔德'])
  })

  it('shows a clear button only when a value exists and clears on click', async () => {
    const wrapper = mount(SearchBar, { props: { modelValue: '' } })
    expect(wrapper.find('.search-clear').exists()).toBe(false)

    await wrapper.setProps({ modelValue: '桔梗' })
    expect(wrapper.find('.search-clear').exists()).toBe(true)

    await wrapper.find('.search-clear').trigger('click')
    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual([''])
  })
})
