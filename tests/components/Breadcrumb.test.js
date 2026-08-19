import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Breadcrumb from '../../src/components/Breadcrumb.vue'

describe('Breadcrumb', () => {
  it('links back to the home page and shows the current section', () => {
    const wrapper = mount(Breadcrumb, { props: { current: '角色' } })
    const link = wrapper.find('a')
    expect(link.text()).toBe('首页')
    expect(link.attributes('href')).toBe('/index.html')
    expect(wrapper.findAll('.breadcrumb > span').at(-1).text()).toBe('角色')
    expect(wrapper.text()).toContain('/')
  })
})
