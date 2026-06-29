export const sampleBattles = [
  {
    "id": 1,
    "name": "魔兽城BOSS",
    "level": "60",
    "weakness": "火",
    "resist": "水",
    "startCondition": "主线剧情第10章完成后",
    "location": "魔兽城·顶层",
    "reward": "魔兽铠甲图鉴、经验卷轴×5",
    "note": "注意AOE攻击",
    "isHiddenBoss": false
  },
  {
    "id": 2,
    "name": "时之塔守卫",
    "level": "55",
    "weakness": "风",
    "resist": "地",
    "startCondition": "支线任务「时之指针」",
    "location": "时之塔·中层",
    "reward": "时之碎片×3、中级经验书",
    "note": "建议带驱散",
    "isHiddenBoss": false
  },
  {
    "id": 3,
    "name": "异境之龙",
    "level": "70",
    "weakness": "雷",
    "resist": "风",
    "startCondition": "异境入口处交纳「龙之泪」",
    "location": "异境·龙之领域",
    "reward": "龙鳞×1、高级武器材料",
    "note": "高伤害单体",
    "isHiddenBoss": false
  },
  {
    "id": 4,
    "name": "古代遗迹BOSS",
    "level": "50",
    "weakness": "地",
    "resist": "火",
    "startCondition": "收集3枚遗迹石板后",
    "location": "古代遗迹·最深处",
    "reward": "遗迹宝箱钥匙×1、金币5000",
    "note": "会召唤小怪",
    "isHiddenBoss": false
  },
  {
    "id": 5,
    "name": "虚空之主",
    "level": "80",
    "weakness": "阴",
    "resist": "雷",
    "startCondition": "通关所有外传后解锁",
    "location": "虚空裂缝·核心",
    "reward": "虚空结晶×1、传说武器图鉴",
    "note": "推荐满级队伍",
    "isHiddenBoss": false
  },
  {
    "id": 6,
    "name": "星幽霸主",
    "level": "90",
    "weakness": "火",
    "resist": "地、风",
    "startCondition": "击败虚空之主后进入星幽裂缝",
    "location": "星幽裂缝·最深处",
    "reward": "星幽结晶×1、UR武器图鉴",
    "note": "超高难度隐藏BOSS",
    "isHiddenBoss": true,
    "hp": "500000",
    "skills": [
      {
        "order": 1,
        "action": "星幽波动",
        "effect": "全体魔法攻击 + 附带混乱效果"
      },
      {
        "order": 2,
        "action": "暗星坠落",
        "effect": "单体超高伤害"
      },
      {
        "order": 3,
        "action": "星之屏障",
        "effect": "自身全属性耐性大幅提升"
      }
    ],
    "strategy": "推荐带驱散角色和魔法坦，优先破坏屏障",
    "detailedRewards": [
      "星幽结晶×1（武器强化材料）",
      "UR武器图鉴随机×1",
      "星幽勋章×1"
    ],
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "videoTitle": "星幽霸主 无续关攻略",
    "strength": "320",
    "intelligence": "280",
    "speed": "250",
    "endurance": "300",
    "spirit": "260",
    "luck": "200",
    "null": "水",
    "absorb": "",
    "traits": [
      "星幽属性",
      "魔法攻击主体",
      "屏障机制",
      "弱火"
    ]
  },
  {
    "id": 7,
    "name": "时空间谍",
    "level": "85",
    "weakness": "风",
    "resist": "火、水",
    "startCondition": "集齐5个时空碎片后在时之塔顶层触发",
    "location": "时之塔·顶层（隐藏房间）",
    "reward": "时空之钥×1、传说防具图鉴",
    "note": "限时30回合",
    "isHiddenBoss": true,
    "hp": "350000",
    "skills": [
      {
        "order": 1,
        "action": "时空乱流",
        "effect": "全体行动顺序重置"
      },
      {
        "order": 2,
        "action": "时间裂隙",
        "effect": "单体即死效果"
      },
      {
        "order": 3,
        "action": "加速领域",
        "effect": "自身速度大幅提升"
      }
    ],
    "strategy": "需要高速角色抢先手，建议携带即死免疫装备",
    "detailedRewards": [
      "时空之钥×1",
      "传说防具图鉴×1",
      "时之结晶×3"
    ],
    "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "videoTitle": "时空间谍 逃课打法",
    "strength": "260",
    "intelligence": "350",
    "speed": "380",
    "endurance": "220",
    "spirit": "300",
    "luck": "280",
    "null": "",
    "absorb": "阴",
    "traits": [
      "时空属性",
      "高速先手",
      "即死技能",
      "弱风"
    ]
  }
]