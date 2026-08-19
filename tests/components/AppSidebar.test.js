import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSidebar from '../../src/components/AppSidebar.vue'
import { navItems } from '../../src/data/nav.js'

describe('AppSidebar', () => {
  it('renders the site header and footer', () => {
    const wrapper = mount(AppSidebar)
    expect(wrapper.find('h1').text()).toBe('另一个伊甸')
    expect(wrapper.find('.sidebar-header span').text()).toBe('攻略查询站')
    expect(wrapper.find('.sidebar-footer').text()).toContain('v1.0')
  })

  it('renders every navigation item with its path', () => {
    const wrapper = mount(AppSidebar)
    const links = wrapper.findAll('a.nav-item')
    expect(links).toHaveLength(navItems.length)
    navItems.forEach((item, i) => {
      expect(links[i].attributes('href')).toBe(item.path)
      expect(links[i].text()).toContain(item.name)
      expect(links[i].find('.nav-icon').text()).toBe(item.icon)
    })
  })

  it('marks the current page as active', () => {
    const wrapper = mount(AppSidebar, { props: { currentPage: 'characters' } })
    const active = wrapper.findAll('a.nav-item').filter((a) => a.classes('active'))
    expect(active).toHaveLength(1)
    expect(active[0].attributes('href')).toBe('/src/pages/characters/index.html')
  })
})
