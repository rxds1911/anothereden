// 星导觉醒「觉醒能力」表格的排版数据
//
// 数据来源：角色数据 character.starGuideAbilities.awaken，每个分类一条记录：
//   { category, condition, initialEffect, enhancedEffect }
// 与天冥值、等级无关，三个分类（天冥能力 / 星导爆裂强化 / 获得能力）都固定两行。
// 表格结构（与游戏内一致）：
//   表头 = 觉醒能力 / 初期效果 / 强化效果
//   每个分类两行：初期效果一行、强化效果一行；条件行在单元格内作为第一行
// 强化效果里数值有变化的部分会被标记为高亮（红色），与图片样式一致。

export const starAbilityOrder = ['天冥能力', '星导爆裂强化', '获得能力']

const NUMBER_PATTERN = /[0-9]+(?:\.[0-9]+)?%?/g

// 找出强化效果里相对初期效果新增/变化的数值，返回可直接渲染的片段数组
export function markEnhancedSegments(initialEffect, enhancedEffect) {
  const initial = String(initialEffect == null ? '' : initialEffect)
  const enhanced = String(enhancedEffect == null ? '' : enhancedEffect)
  const initialNumbers = new Set(initial.match(NUMBER_PATTERN) || [])
  const segments = []
  let cursor = 0
  for (const match of enhanced.matchAll(NUMBER_PATTERN)) {
    const value = match[0]
    if (initialNumbers.has(value)) continue
    if (match.index > cursor) segments.push({ text: enhanced.slice(cursor, match.index), diff: false })
    segments.push({ text: value, diff: true })
    cursor = match.index + value.length
  }
  if (cursor < enhanced.length) segments.push({ text: enhanced.slice(cursor), diff: false })
  if (!segments.length) segments.push({ text: enhanced, diff: false })
  return segments
}

function orderIndex(category) {
  const index = starAbilityOrder.indexOf(category)
  return index === -1 ? starAbilityOrder.length : index
}

function blockCondition(item) {
  return String(item.condition || '')
}

function initialBlock(item) {
  return {
    cond: blockCondition(item),
    segments: [{ text: String(item.initialEffect || ''), diff: false }]
  }
}

function enhancedBlock(item) {
  return {
    cond: blockCondition(item),
    segments: markEnhancedSegments(item.initialEffect, item.enhancedEffect)
  }
}

// 每个分类固定输出两行：初期效果 / 强化效果。
// 分类名只在第一行输出并通过 rowspan 纵向跨两行。
export function buildAwakenRows(abilities = []) {
  const groups = new Map()
  for (const item of abilities) {
    const category = item.category || '其他'
    if (!groups.has(category)) groups.set(category, [])
    groups.get(category).push(item)
  }

  const sorted = [...groups.entries()].sort((a, b) => orderIndex(a[0]) - orderIndex(b[0]))
  const rows = []
  for (const [category, items] of sorted) {
    rows.push({
      key: category + '-initial',
      category,
      categoryRowspan: 2,
      enhanced: false,
      blocks: items.map(initialBlock)
    })
    rows.push({
      key: category + '-enhanced',
      category,
      categoryRowspan: null,
      enhanced: true,
      blocks: items.map(enhancedBlock)
    })
  }
  return rows
}