// Battle video guide helpers: built-in guide seed + localStorage persistence.

const STORAGE_PREFIX = 'anothereden.battleGuides.'

// Accepts normal bilibili video pages, player embed URLs and b23.tv short links.
export function isValidBilibiliUrl(value) {
  const text = String(value || '').trim()
  if (!text) return false
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : 'https://' + text)
    const host = url.hostname.toLowerCase()
    return host === 'bilibili.com' ||
      host.endsWith('.bilibili.com') ||
      host === 'b23.tv' ||
      host.endsWith('.b23.tv')
  } catch {
    return /bilibili\.com|b23\.tv/i.test(text)
  }
}

// Builds the built-in guide attached to a battle (if it has a video link).
export function buildBuiltinGuide(battle) {
  if (!battle || !battle.videoUrl) return null
  return {
    id: 'builtin-' + battle.id,
    title: battle.videoTitle || `「${battle.name}」示例攻略`,
    url: battle.videoUrl,
    team: battle.team || { front: [], back: [], partner: [] },
    source: 'builtin',
    createdAt: ''
  }
}

export function loadUserGuides(battleId) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + battleId)
    const list = raw ? JSON.parse(raw) : []
    if (!Array.isArray(list)) return []
    return list.map(guide => ({
      ...guide,
      team: {
        front: Array.isArray(guide.team && guide.team.front) ? guide.team.front.filter(Boolean) : [],
        back: Array.isArray(guide.team && guide.team.back) ? guide.team.back.filter(Boolean) : [],
        partner: Array.isArray(guide.team && guide.team.partner) ? guide.team.partner.filter(Boolean) : []
      }
    }))
  } catch (error) {
    console.error('读取本地攻略失败', error)
    return []
  }
}

export function saveUserGuides(battleId, guides) {
  try {
    localStorage.setItem(STORAGE_PREFIX + battleId, JSON.stringify(guides))
  } catch (error) {
    console.error('保存本地攻略失败', error)
  }
}
