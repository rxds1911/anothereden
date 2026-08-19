import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { navItems } from '../src/data/nav.js'

const projectRoot = process.cwd()

describe('navItems', () => {
  it('contains exactly the 16 expected sections in order', () => {
    expect(navItems.map((n) => n.id)).toEqual([
      'index', 'characters', 'battle', 'weapons', 'armor', 'badges',
      'partner', 'maps', 'grasta', 'bookshelf', 'cats', 'diary',
      'personal-weapons', 'reincarnation', 'dungeons', 'events'
    ])
  })

  it('has unique ids, unique paths and non-empty labels/icons', () => {
    expect(new Set(navItems.map((n) => n.id)).size).toBe(navItems.length)
    expect(new Set(navItems.map((n) => n.path)).size).toBe(navItems.length)
    for (const item of navItems) {
      expect(item.name).toBeTruthy()
      expect(item.icon).toBeTruthy()
      expect(item.path.startsWith('/')).toBe(true)
    }
  })

  it('points to files that exist in the project', () => {
    for (const item of navItems) {
      const file = resolve(projectRoot, item.path.replace(/^\//, ''))
      expect(existsSync(file), `${item.id} -> ${item.path}`).toBe(true)
    }
  })
})
