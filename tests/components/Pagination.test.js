import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '../../src/components/Pagination.vue'

describe('Pagination', () => {
  it('emits the selected page and exposes the current page accessibly', async () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 1, totalPages: 7, totalItems: 74, pageSize: 12 }
    })

    expect(wrapper.find('[aria-current="page"]').text()).toBe('1')
    await wrapper.findAll('.pagination-page-btn')[1].trigger('click')
    expect(wrapper.emitted('update:currentPage')).toEqual([[2]])
  })

  it('uses ellipses for large page ranges', () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 5, totalPages: 10, totalItems: 120, pageSize: 12 }
    })

    expect(wrapper.findAll('.pagination-ellipsis')).toHaveLength(2)
    expect(wrapper.text()).toContain('第 5 / 10 页')
  })

  it('does not render when there is only one page', () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 1, totalPages: 1, totalItems: 3, pageSize: 12 }
    })

    expect(wrapper.find('.pagination').exists()).toBe(false)
  })
})
