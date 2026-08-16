import { sampleBookshelf } from './bookshelf.js'

const conditionTemplates = [
  b => `将「${b.bonus}」的等级提升至25以上`,
  b => `通关「${b.name}」1次`,
  b => `编成「${b.bonus}」的队伍获得胜利`,
  b => `讨伐${b.type}相关区域的敌人5只`,
  b => `达成「${b.name}」中「${b.bonus}」的全部契约`
]

const rewardPool = ['克罗诺斯之石×30', '修炼EXP×30', '中级转化子晶×20', '祈祷之雫×10', '火炎的副牌×1', '魔力徽章×1', '小鬼的绊符×10', '绿之奥×3']

const stageRewards = [
  '克罗诺斯之石×30', '特殊碎片×5', '天之调香×1', '克罗诺斯之石×10', '特殊碎片×10',
  '天之调香×1', '克罗诺斯之石×10', '特殊结晶×5', '天之调香×1', '克罗诺斯之石×50、挑战者之证×1'
]

const rotate = (arr, n) => arr.map((_, i) => arr[(i + n) % arr.length])

export const bookshelfDetails = sampleBookshelf.map((b, bi) => {
  const makeRows = offset => rotate(conditionTemplates, bi + offset)
    .slice(0, 6)
    .map((t, i) => ({
      condition: t(b),
      rewards: rotate(rewardPool, bi + i).slice(0, 3),
      alt: i % 2 === 1
    }))

  const bonusTargets = [
    { target: `编成角色「${b.bonus}」`, points: '行动Bonus +30' },
    { target: '编成「火」个性角色', points: '行动Bonus +60' },
    { target: '编成「诺鲁奥基」个性角色', points: '行动Bonus +60' }
  ]

  return {
    id: b.id,
    name: b.name,
    type: b.type,
    repairConditions: makeRows(0),
    rewardStages: stageRewards.map((reward, i) => ({ stage: i + 1, reward })),
    bonusCharacters: bonusTargets,
    videoTitle: `「${b.name}」攻略视频`,
    videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7y7&autoplay=0',
    team: {
      front: [b.bonus, '菲奈', '茜', '艾米'],
      back: ['莉卡', '塞温'],
      partner: ['帕蒂', '克罗德']
    }
  }
})
