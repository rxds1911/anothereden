import { samplePartners } from './partner.js'

const autoSkillPool = [
  { name: '热焰拳击', charge: 1, desc: '对随机敌方单体进行火属性打攻击（特大）', bonus: '随着回合经过威力提升', note: '最大10回合/5倍' },
  { name: '疾风斩击', charge: 1, desc: '对敌方单体进行风属性斩攻击（特大）', bonus: '对中毒对象威力提升' },
  { name: '苍蓝突刺', charge: 2, desc: '对敌方单体进行水属性突攻击（特大）', bonus: '自身速度UP' },
  { name: '冥雷轰炸', charge: 1, desc: '对敌方全体进行雷属性魔攻击（特大）', bonus: '赋予麻痹' }
]

const chargeSkillPool = [
  { name: '奇迹蒸汽', charge: 5, desc: 'Another Force槽回复30%', condition: '前卫有「{char}」时', condDesc: 'Another Force槽回复50%' },
  { name: '星海爆发', charge: 4, desc: '对敌方全体进行晶属性魔攻击（极大）', condition: '敌人HP50%以下时', condDesc: '威力1.5倍' },
  { name: '破魔之矛', charge: 6, desc: '对敌方单体进行阴属性突攻击（极大）', condition: '我方全员存活时', condDesc: '必定暴击' },
  { name: '龙鸣咆哮', charge: 5, desc: '我方全体攻击UP（3回合）', condition: 'BOSS战时', condDesc: '额外附加HP回复' }
]

const auraPool = [
  { name: '火焰干扰器', target: '敌我单体', condition: '受到火属性伤害时', effect: '满足条件的友方单体腕力与知性25%DOWN' },
  { name: '光之加护', target: '我方单体', condition: '回合开始时', effect: '赋予HP回复（持续3回合）' },
  { name: '暗之庇护', target: '我方全体', condition: '我方任一角色濒死时', effect: '全属性耐性UP（2回合）' }
]

const rotate = (arr, n) => arr.map((_, i) => arr[(i + n) % arr.length])

export const partnerDetails = samplePartners.map((p, pi) => ({
  id: p.id,
  name: p.name,
  rarity: p.rarity,
  attribute: ['打', '突', '斩', '魔'][pi % 4],
  source: p.source,
  autoSkills: rotate(autoSkillPool, pi).slice(0, 2),
  chargeSkills: rotate(chargeSkillPool, pi).slice(0, 2).map(s => ({
    ...s,
    condition: s.condition.replace('{char}', p.name)
  })),
  auras: rotate(auraPool, pi).slice(0, 2)
}))
