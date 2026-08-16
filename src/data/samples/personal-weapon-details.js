import { samplePersonalWeapons } from './personal-weapons.js'
import { vowOptions } from '../config.js'

const rotate = (arr, n) => arr.map((_, i) => arr[(i + n) % arr.length])

const effectStages = [
  { level: 10, effects: ['腕力30UP', '速度30UP'] },
  { level: 11, effects: ['MP消费攻击'] }
]

const rewardRows = [
  { difficulty: 'STANDARD', first: ['技能槽1解放', '显现之斗气×500'], rare: ['薄红之才珠', '薄铅之才珠'] },
  { difficulty: 'HARD', first: ['技能槽2解放', '显现之斗气×1,000'], rare: ['薄红之才珠', '薄铅之才珠'] },
  { difficulty: 'VERY HARD', first: ['技能槽3解放', '显现之斗气×1,500'], rare: ['薄红之才珠', '薄铅之才珠', '红莲之才珠'] },
  { difficulty: 'CHALLENGE', first: ['显现之斗气×2,000'], rare: ['薄红之才珠', '薄铅之才珠', '红莲之才珠'] }
]

export const personalWeaponDetails = samplePersonalWeapons
  .filter(w => w.tab === '结果')
  .map(w => ({
    id: w.id,
    name: w.name,
    character: w.character,
    effectStages,
    rewards: rewardRows,
    vows: rotate(vowOptions, w.id).slice(0, 4),
    guides: [0, 1, 2, 3].map(i => {
      const otherChars = ['菲奈', '茜', '艾米', '莉卡', '塞温', '帕蒂', '克罗德']
      const chars = rotate(otherChars, w.id + i)
      return {
        title: `「${w.name}」${['平民队', '低配', '速通', '稳定'][i]}攻略`,
        url: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7y7&autoplay=0',
        vows: rotate(vowOptions, w.id + i).slice(0, 2),
        team: {
          front: [w.character, ...chars.slice(0, 3)],
          back: chars.slice(3, 5),
          partner: chars.slice(5, 7)
        }
      }
    }),
    videoTitle: `「${w.name}」攻略视频`,
    videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7y7&autoplay=0',
    team: {
      front: [w.character, '菲奈', '茜', '艾米'],
      back: ['莉卡', '塞温'],
      partner: ['帕蒂', '克罗德']
    }
  }))

const skillPools = [
  { name: '魔界枪击', mp: 41, desc: '对敌全体进行突属性攻击（特大）', bonus: '+赋予猛毒和痛苦，无视对象的抗性' },
  { name: '龙之突击', mp: 41, desc: '对敌全体进行风属性突攻击2次（特大）', bonus: '对象处于毒·痛苦状态时威力增加' },
  { name: '星海之枪', mp: 45, desc: '对敌单体进行晶属性突攻击（极大）', bonus: '暴击时威力大幅增加' },
  { name: '冥狱之矛', mp: 48, desc: '对敌全体进行阴属性突攻击（极大）', bonus: '赋予暗闇状态' }
]

export const personalWeaponManifestDetails = samplePersonalWeapons
  .filter(w => w.tab === '显现')
  .map((w, wi) => ({
    id: w.id,
    name: w.name,
    character: w.character,
    finalStats: { level: 60, atk: 190 + wi * 7, magic: 23 + wi * 2 },
    effects: w.effect.split('+'),
    skills: rotate(skillPools, wi).slice(0, 2),
    videoTitle: `「${w.name}」显现攻略视频`,
    videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1GJ411x7y7&autoplay=0',
    team: {
      front: [w.character, '菲奈', '茜', '艾米'],
      back: ['莉卡', '塞温'],
      partner: ['帕蒂', '克罗德']
    }
  }))
