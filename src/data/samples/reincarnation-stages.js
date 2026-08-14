// 回生关卡数据：Normal / Extreme 各 5 关，每关包含若干条件与报酬
export const reincarnationStages = {
  Normal: [
    {
      stage: 1,
      missions: [
        { condition: "队伍成员一次都没有战斗不能", reward: "克罗诺斯之石×20" },
        { condition: "15回合以内通关", reward: "梦咏之书×1" }
      ]
    },
    {
      stage: 2,
      missions: [
        { condition: "队伍成员一次都没有战斗不能", reward: "克罗诺斯之石×20" },
        { condition: "编入艾米和莉卡", reward: "获得经验值50%UP徽章" }
      ]
    },
    {
      stage: 3,
      missions: [
        { condition: "队伍成员一次都没有战斗不能", reward: "克罗诺斯之石×10" },
        { condition: "20回合以内通关", reward: "上级秘传书×200" },
        { condition: "10回合以内通关", reward: "歌出现频率UP徽章" }
      ]
    },
    {
      stage: 4,
      missions: [
        { condition: "队伍成员一次都没有战斗不能", reward: "克罗诺斯之石×20" },
        { condition: "仅用「天」角色通关", reward: "梦咏之书×1" }
      ]
    },
    {
      stage: 5,
      missions: [
        { condition: "队伍成员一次都没有战斗不能", reward: "克罗诺斯之石×20" },
        { condition: "编入阿尔德和菲涅", reward: "区域回复获得徽章×1" },
        { condition: "10回合以内通关", reward: "梦咏之书×1" }
      ]
    }
  ],
  Extreme: [
    {
      stage: 1,
      missions: [
        { condition: "队伍成员一次都没有战斗不能", reward: "克罗诺斯之石×30" },
        { condition: "不使用Another Force", reward: "梦咏之书×1" }
      ]
    },
    {
      stage: 2,
      missions: [
        { condition: "队伍成员一次都没有战斗不能", reward: "克罗诺斯之石×30" },
        { condition: "编入阿尔德、艾米和莉卡", reward: "速度+40徽章" }
      ]
    },
    {
      stage: 3,
      missions: [
        { condition: "队伍成员一次都没有战斗不能", reward: "克罗诺斯之石×30" },
        { condition: "15回合以内通关", reward: "MP快愈力徽章（妨害时MP回复量+50%）" },
        { condition: "仅用男性队伍通关", reward: "梦咏之书×1" }
      ]
    },
    {
      stage: 4,
      missions: [
        { condition: "队伍成员一次都没有战斗不能", reward: "克罗诺斯之石×30" },
        { condition: "编入阿尔德、菲涅和塞拉斯", reward: "巨人徽章（HP+1,000/速度-100）" }
      ]
    },
    {
      stage: 5,
      missions: [
        { condition: "队伍成员一次都没有战斗不能", reward: "克罗诺斯之石×30" },
        { condition: "15回合以内通关", reward: "克罗诺斯之石×50" },
        { condition: "仅用「天」角色通关", reward: "苏生之咒Glass×1、习得技能「复活」" }
      ]
    }
  ]
}
