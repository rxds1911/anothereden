export const sampleWeapons = [
  // 杖
  { id: 1, name: "星云之杖", type: "杖", equipLevel: 40, atk: 55, matk: 155, effect: "MP消耗减少", source: "副本掉落", condition: "任意角色" },
  { id: 2, name: "白银法杖", type: "杖", equipLevel: 25, atk: 35, matk: 108, effect: "精神+5", source: "商店购买", condition: "任意角色" },
  { id: 3, name: "精灵王杖", type: "杖", equipLevel: 60, atk: 78, matk: 196, effect: "全属性攻击UP", source: "异境掉落", condition: "任意角色" },
  { id: 25, name: "地神之杖", type: "杖", equipLevel: 60, atk: 60, matk: 195, effect: "地属性攻击UP+MP消耗减少", source: "角色任务3", character: "莉卡", condition: "莉卡" },
  // 剑
  { id: 4, name: "斩龙剑", type: "剑", equipLevel: 45, atk: 172, matk: 0, effect: "龙系特攻", source: "锻造", condition: "任意角色" },
  { id: 5, name: "泰坦巨剑", type: "剑", equipLevel: 55, atk: 195, matk: 0, effect: "力量+10", source: "隐藏任务", condition: "任意角色" },
  { id: 26, name: "水神之刃", type: "剑", equipLevel: 58, atk: 210, matk: 0, effect: "水属性攻击UP+暴击率UP", source: "角色任务3", character: "茜", condition: "茜" },
  { id: 6, name: "圣剑埃尔德", type: "剑", equipLevel: 70, atk: 220, matk: 0, effect: "对魔物特攻", source: "钓鱼兑换", condition: "任意角色" },
  // 刀
  { id: 7, name: "神刀-村雨", type: "刀", equipLevel: 55, atk: 225, matk: 0, effect: "HP最大时伤害UP+属性攻击UP", source: "角色任务3", character: "阿尔德", condition: "阿尔德" },
  { id: 8, name: "妖刀红月", type: "刀", equipLevel: 58, atk: 200, matk: 0, effect: "吸血效果", source: "副本掉落", condition: "任意角色" },
  { id: 9, name: "雷神刀", type: "刀", equipLevel: 65, atk: 212, matk: 0, effect: "雷属性攻击UP", source: "异境掉落", condition: "任意角色" },
  // 斧
  { id: 10, name: "战斧·裂地", type: "斧", equipLevel: 35, atk: 150, matk: 0, effect: "破除物理耐性", source: "锻造", condition: "任意角色" },
  { id: 11, name: "巨人粉碎者", type: "斧", equipLevel: 55, atk: 190, matk: 0, effect: "力量+8", source: "隐藏任务", condition: "任意角色" },
  { id: 12, name: "陨铁巨斧", type: "斧", equipLevel: 68, atk: 218, matk: 0, effect: "无视防御UP", source: "副本掉落", condition: "任意角色" },
  // 枪
  { id: 13, name: "无尽之枪", type: "枪", equipLevel: 42, atk: 160, matk: 0, effect: "HP回复", source: "隐藏任务", condition: "任意角色" },
  { id: 27, name: "雷神之枪", type: "枪", equipLevel: 62, atk: 220, matk: 0, effect: "雷属性攻击UP+HP回复", source: "角色任务3", character: "塞温", condition: "塞温" },
  { id: 14, name: "龙枪·晨曦", type: "枪", equipLevel: 52, atk: 178, matk: 0, effect: "龙系特攻", source: "异境掉落", condition: "任意角色" },
  { id: 15, name: "圣枪朗基努斯", type: "枪", equipLevel: 72, atk: 228, matk: 0, effect: "速度+15", source: "钓鱼兑换", condition: "任意角色" },
  // 弓
  { id: 16, name: "龙鳞之弓", type: "弓", equipLevel: 44, atk: 168, matk: 0, effect: "龙系特攻", source: "异境掉落", condition: "任意角色" },
  { id: 17, name: "精灵弓", type: "弓", equipLevel: 30, atk: 128, matk: 0, effect: "幸运+5", source: "商店购买", condition: "任意角色" },
  { id: 18, name: "月神弓", type: "弓", equipLevel: 66, atk: 205, matk: 0, effect: "速度+10", source: "副本掉落", condition: "任意角色" },
  { id: 28, name: "风神弓", type: "弓", equipLevel: 56, atk: 200, matk: 0, effect: "风属性攻击UP+速度UP", source: "角色任务3", character: "艾米", condition: "艾米" },
  // 拳
  { id: 19, name: "斗神拳套", type: "拳", equipLevel: 40, atk: 155, matk: 0, effect: "连续攻击UP", source: "锻造", condition: "任意角色" },
  { id: 20, name: "白虎爪", type: "拳", equipLevel: 60, atk: 198, matk: 0, effect: "力量+12", source: "异境掉落", condition: "任意角色" },
  { id: 21, name: "玄武臂铠", type: "拳", equipLevel: 48, atk: 170, matk: 0, effect: "全属性耐性UP", source: "任务奖励", condition: "任意角色" },
  // 锤
  { id: 22, name: "战锤·碎星", type: "锤", equipLevel: 38, atk: 148, matk: 0, effect: "粉碎防御", source: "锻造", condition: "任意角色" },
  { id: 23, name: "大地之锤", type: "锤", equipLevel: 56, atk: 188, matk: 0, effect: "地属性攻击UP", source: "异境掉落", condition: "任意角色" },
  { id: 24, name: "圣锤米迦勒", type: "锤", equipLevel: 70, atk: 222, matk: 0, effect: "对魔族特攻", source: "隐藏任务", condition: "任意角色" }
]
