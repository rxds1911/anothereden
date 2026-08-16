import { sampleDungeons } from './dungeons.js'

const chestItemPool = ['克罗诺斯之石×10', '中级武器材料×3', '灵晶碎片×2', '经验卷轴×2', '高级防具材料×1', '异节×1', '典录×1', '速度+20徽章']
const areaSuffix = ['入口', '深处', '最深处']

const enemyPool = {
  '主线': [
    { name: '魔兽小兵', weakness: ['火'], resist: [], drops: ['魔兽皮', '铜勋章'] },
    { name: '城寨守卫', weakness: ['风'], resist: ['打'], drops: ['守卫的盾牌碎片', '铜勋章'] },
    { name: 'BOSS 魔兽将军', weakness: ['雷'], resist: ['地'], drops: ['将军的徽记', '银勋章'], boss: true }
  ],
  '外典': [
    { name: '星幽徘徊者', weakness: ['晶'], resist: ['无'], drops: ['星幽碎片', '暗之结晶'] },
    { name: '虚空蠕虫', weakness: ['阴'], resist: ['火'], drops: ['虚空之尘', '异节'] },
    { name: 'BOSS 星幽霸主', weakness: ['火'], resist: ['地、风'], drops: ['星幽结晶', '典录'], boss: true }
  ],
  '外传': [
    { name: '异境野兽', weakness: ['雷'], resist: ['风'], drops: ['兽皮', '龙鳞'] },
    { name: '龙之幼体', weakness: ['地'], resist: ['火'], drops: ['龙之鳞片', '异节'] },
    { name: 'BOSS 异境之龙', weakness: ['雷'], resist: ['风'], drops: ['龙鳞×1', '高级武器材料'], boss: true }
  ],
  '断章': [
    { name: '时空追迹者', weakness: ['风'], resist: ['火'], drops: ['时光齿轮', '时之碎片'] },
    { name: '时之守卫', weakness: ['雷'], resist: ['地'], drops: ['时之锁链', '中级经验书'] },
    { name: 'BOSS 时空扭曲者', weakness: ['晶'], resist: ['阴'], drops: ['时空之钥', '典录'], boss: true }
  ],
  '协奏': [
    { name: '剧场傀儡', weakness: ['水'], resist: ['魔'], drops: ['傀儡丝', '协奏乐谱'] },
    { name: '舞台幻影', weakness: ['火'], resist: ['水'], drops: ['幻影粉尘', '异节'] },
    { name: 'BOSS 异界主演', weakness: ['晶'], resist: ['无'], drops: ['谢幕的掌声', '典录'], boss: true }
  ],
  '群像': [
    { name: '剑圣门徒', weakness: ['突'], resist: ['斩'], drops: ['剑术心得', '钢之碎片'] },
    { name: '术士学徒', weakness: ['打'], resist: ['魔'], drops: ['术式残页', '灵晶碎片'] },
    { name: 'BOSS 群像之主', weakness: ['雷', '晶'], resist: ['打', '突', '斩', '魔'], drops: ['群像的秘宝', '典录'], boss: true }
  ],
  '外史': [
    { name: '古战亡魂', weakness: ['地'], resist: ['风'], drops: ['锈蚀兵器', '遗物碎片'] },
    { name: '冥宫守卫', weakness: ['阴'], resist: ['火'], drops: ['冥宫钥匙', '异节'] },
    { name: 'BOSS 外史统治者', weakness: ['水', '雷'], resist: ['打', '斩'], drops: ['外史的秘典', '典录'], boss: true }
  ],
  '封域': [
    { name: '冰牢守卫', weakness: ['火'], resist: ['水'], drops: ['寒冰结晶', '封域之钥'] },
    { name: '炎狱魔像', weakness: ['水'], resist: ['火'], drops: ['熔岩核心', '异节'] },
    { name: 'BOSS 封域之主', weakness: ['晶'], resist: ['无'], drops: ['封域之印', '典录'], boss: true }
  ],
  '异境': [
    { name: '草原狼', weakness: ['风'], resist: ['地'], drops: ['兽牙', '低级素材'] },
    { name: '洞窟蝙蝠', weakness: ['火'], resist: ['雷'], drops: ['蝠翼', '中级素材'] },
    { name: 'BOSS 异境守卫', weakness: ['雷'], resist: ['风'], drops: ['异境结晶', '典录'], boss: true }
  ]
}

const rotate = (arr, n) => arr.map((_, i) => arr[(i + n) % arr.length])

export const dungeonDetails = sampleDungeons.map(d => {
  const idx = d.id
  const chests = [0, 1, 2].map(i => ({ no: i + 1, area: d.name + '·' + areaSuffix[i], items: {} }))
  const baseEnemies = rotate(enemyPool[d.type], idx).slice(0, 3)
  const enemies = baseEnemies.map(e => ({
    name: e.name,
    weakness: e.weakness,
    resist: e.resist,
    boss: !!e.boss,
    drops: {}
  }))
  d.difficulties.forEach((diff, di) => {
    chests.forEach((c, i) => { c.items[diff] = rotate(chestItemPool, idx + i + di * 3).slice(0, 3) })
    baseEnemies.forEach((e, ei) => { enemies[ei].drops[diff] = rotate(e.drops, idx + ei + di * 2) })
  })
  return {
    id: d.id,
    name: d.name,
    type: d.type,
    difficulties: d.difficulties,
    chests,
    enemies
  }
})
