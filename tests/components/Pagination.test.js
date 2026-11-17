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

  it('shows the first and last page groups without losing the boundary pages', () => {
    const start = mount(Pagination, {
      props: { currentPage: 4, totalPages: 10, totalItems: 120, pageSize: 12 }
    })
    expect(start.findAll('.pagination-page-btn').map((button) => button.text()))
      .toEqual(['1', '2', '3', '4', '5', '10'])
    expect(start.findAll('.pagination-ellipsis')).toHaveLength(1)

    const end = mount(Pagination, {
      props: { currentPage: 8, totalPages: 10, totalItems: 120, pageSize: 12 }
    })
    expect(end.findAll('.pagination-page-btn').map((button) => button.text()))
      .toEqual(['1', '6', '7', '8', '9', '10'])
    expect(end.findAll('.pagination-ellipsis')).toHaveLength(1)
  })

  it('navigates with previous/next controls and ignores a click on the current page', async () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 4, totalPages: 10, totalItems: 120, pageSize: 12 }
    })
    const [previous, next] = wrapper.findAll('.pagination-nav')

    await previous.trigger('click')
    await next.trigger('click')
    expect(wrapper.emitted('update:currentPage')).toEqual([[3], [5]])

    const current = mount(Pagination, {
      props: { currentPage: 2, totalPages: 10, totalItems: 120, pageSize: 12 }
    })
    await current.findAll('.pagination-page-btn')
      .find((button) => button.text() === '2')
      .trigger('click')
    expect(current.emitted('update:currentPage')).toBeUndefined()
  })

  it('does not render when there is only one page', () => {
    const wrapper = mount(Pagination, {
      props: { currentPage: 1, totalPages: 1, totalItems: 3, pageSize: 12 }
    })

    expect(wrapper.find('.pagination').exists()).toBe(false)
  })
})
