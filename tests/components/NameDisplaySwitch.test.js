import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSidebar from '../../src/components/AppSidebar.vue'
import NameDisplaySwitch from '../../src/components/NameDisplaySwitch.vue'
import { defaultNameDisplayMode, nameDisplayModes } from '../../src/data/config.js'
import { nameDisplayState, setNameDisplayMode } from '../../src/utils/name-display.js'

beforeEach(() => {
  localStorage.clear()
  setNameDisplayMode(defaultNameDisplayMode)
})

describe('NameDisplaySwitch', () => {
  it('renders one button per configured mode', () => {
    const wrapper = mount(NameDisplaySwitch)
    const buttons = wrapper.findAll('button.name-switch-btn')
    expect(buttons).toHaveLength(nameDisplayModes.length)
    expect(buttons.map((b) => b.text())).toEqual(nameDisplayModes.map((m) => m.label))
  })

  it('highlights the active mode and switches it on click', async () => {
    const wrapper = mount(NameDisplaySwitch)
    expect(wrapper.findAll('button.name-switch-btn')[0].classes()).toContain('active')

    await wrapper.findAll('button.name-switch-btn')[2].trigger('click')
    expect(nameDisplayState.mode).toBe('jpName')
    expect(wrapper.findAll('button.name-switch-btn')[2].classes()).toContain('active')
    expect(wrapper.findAll('button.name-switch-btn')[0].classes()).not.toContain('active')
  })

  it('is wired into the sidebar so every page can reach it', () => {
    const wrapper = mount(AppSidebar)
    expect(wrapper.find('.name-switch').exists()).toBe(true)
    expect(wrapper.findAll('.name-switch-btn')).toHaveLength(nameDisplayModes.length)
    expect(wrapper.find('.sidebar-footer').text()).toContain('v1.0')
  })
})
