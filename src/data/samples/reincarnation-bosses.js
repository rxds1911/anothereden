// 回生关卡 Boss 数据：按难度分波次（Wave）
export const reincarnationBosses = {
  Normal: [
    {
      wave: 1,
      bosses: [
        { name: '时层的看守', weakness: ['水'], resist: ['火'], note: '吸收' },
        { name: '沉没时层的看守', weakness: ['地'], resist: ['水'], note: '吸收' }
      ]
    },
    {
      wave: 2,
      bosses: [
        { name: '极机院·试作型', weakness: ['雷'], resist: ['火', '水', '风', '晶', '斩', '突', '打', '魔'] }
      ]
    },
    {
      wave: 3,
      bosses: [
        { name: '金织的雷使者', weakness: ['雷', '突'], resist: ['斩', '打', '魔'] }
      ]
    }
  ],
  Extreme: [
    {
      wave: 1,
      bosses: [
        { name: '灼烧时层的极机院', weakness: ['水'], resist: ['火'], note: '吸收' },
        { name: '干涸时层的极机院', weakness: ['风'], resist: ['地'], note: '吸收' }
      ]
    },
    {
      wave: 2,
      bosses: [
        { name: '极机院·正式型', weakness: ['雷'], resist: ['火', '水', '风', '晶', '斩', '突', '打', '魔'] }
      ]
    },
    {
      wave: 3,
      bosses: [
        { name: '金织的雷神官', weakness: ['雷', '突'], resist: ['斩', '打', '魔'] }
      ]
    }
  ]
}
