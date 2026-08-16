import { sampleMaps } from './maps.js'

// 各地图拾取物与怪物示例数据（按时代生成，同一时代内按地图错位取池）
const itemPool = {
  '现代': ['红目玉', '魔兽的战斧', '魔兽的笼手', '鞣制皮革', '流离之民的圣典·第十三篇'],
  '未来': ['磁力碎片', '未来合金', '时光齿轮', '能量结晶', '星港的徽章'],
  '古代': ['古代陶片', '龙之鳞片', '远古石板', '灵峰的草药', '失落王朝的文书'],
  '次元夹缝': ['幻象之尘', '冥界之露', '夹缝的钥匙', '影之结晶', '虚空的残片'],
  '虚时层': ['蚀时之砂', '石华之晶', '猫人之铃', '机人之芯', '虚时层的遗物']
}

const shinyPool = {
  '现代': ['海鸟之羽', '珍珠', '白莲花'],
  '未来': ['星尘碎片', '月光宝石', '未来之种'],
  '古代': ['龙之泪', '黄金果实', '远古水晶'],
  '次元夹缝': ['幻梦之珠', '冥界之花', '夹缝的星沙'],
  '虚时层': ['蚀时之华', '石华之心', '虚时层的钥匙']
}

const monsterPool = {
  '现代': [
    { name: '饿时迅猛龙', weakness: ['雷'], resist: ['地'], drops: ['生锈的魔石', '腐蚀的虚石', '加布尔'] },
    { name: '饿时魔像', weakness: ['水', '风', '雷', '晶'], resist: ['打', '突', '斩', '魔'], drops: ['生锈的魔石', '腐蚀的虚石', '加布尔'] },
    { name: '饿时黄蜂', weakness: ['突', '雷'], resist: ['魔', '打'], drops: ['生锈的魔石', '腐蚀的虚石', '加布尔'] }
  ],
  '未来': [
    { name: '机械哨兵', weakness: ['雷'], resist: ['无'], drops: ['磁力碎片', '未来合金'] },
    { name: '时空追迹者', weakness: ['晶'], resist: ['阴'], drops: ['时光齿轮', '能量结晶'] },
    { name: '浮游炮台', weakness: ['风'], resist: ['地'], drops: ['未来合金', '星港的徽章'] }
  ],
  '古代': [
    { name: '古代兵器', weakness: ['雷', '晶'], resist: ['斩', '突'], drops: ['古代陶片', '失落王朝的文书'] },
    { name: '石像守卫', weakness: ['水'], resist: ['魔'], drops: ['远古石板', '灵峰的草药'] },
    { name: '龙之幼体', weakness: ['水'], resist: ['火'], drops: ['龙之鳞片', '古代陶片'] }
  ],
  '次元夹缝': [
    { name: '幻象之影', weakness: ['晶'], resist: ['无'], drops: ['幻象之尘', '影之结晶'] },
    { name: '冥界之犬', weakness: ['雷'], resist: ['阴'], drops: ['冥界之露', '夹缝的钥匙'] },
    { name: '虚空聚合体', weakness: ['风'], resist: ['地'], drops: ['虚空的残片', '幻象之尘'] }
  ],
  '虚时层': [
    { name: '蚀时沙虫', weakness: ['水'], resist: ['地'], drops: ['蚀时之砂', '虚时层的遗物'] },
    { name: '石华人卫兵', weakness: ['火'], resist: ['晶'], drops: ['石华之晶', '蚀时之砂'] },
    { name: '机人哨戒机', weakness: ['雷'], resist: ['魔'], drops: ['机人之芯', '石华之晶'] }
  ]
}

const marks = ['①', '②', '③', '④', '⑤']
const rotate = (arr, n) => arr.map((_, i) => arr[(i + n) % arr.length])

export const mapDetails = sampleMaps.map(m => {
  const idx = m.id
  const items = rotate(itemPool[m.era], idx).slice(0, 5).map((name, i) => ({ mark: marks[i], name }))
  const shiny = rotate(shinyPool[m.era], idx).slice(0, 3).map((name, i) => ({ mark: '★' + (i + 1), name }))
  const monsters = m.category === '野外·迷宫'
    ? rotate(monsterPool[m.era], idx).slice(0, 3)
    : []
  return { id: m.id, name: m.name, category: m.category, era: m.era, area: m.area, items, shiny, monsters }
})
