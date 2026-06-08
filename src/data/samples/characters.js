export const sampleCharacters = [
  {
    "id": "alde",
    "name": "阿尔德",
    "element": "火",
    "weapon": "刀",
    "stars": "5",
    "role": "主人公",
    "job": "超时空勇者",
    "title": "被选中的少年",
    "form": "NS",
    "personality": ["主人公", "天之指引", "剑术天赋"],
    "lightShadow": "天",
    "gender": "男",
    "starGuide": "已开放",
    "grasta": "火/刀",
    "tomeDrop": "异境-VH 第3层",
    "voiceActor": "杉田智和",
    "acquisition": "剧情通关第2章后加入",
    "maxLv": "80",
    "hp": "3642",
    "mp": "452",
    "pAtk": "245",
    "pDef": "218",
    "mAtk": "182",
    "mDef": "174",
    "speed": "232",
    "description": "从异世界被召唤而来的少年，拥有与魔兽沟通的特殊能力。",
    "skills": [
      {
        "name": "火焰斩",
        "type": "火",
        "cost": 22,
        "desc": "给予单一敌人火属性斩攻击（特大）",
        "skillType": "战斗宣言"
      ,
        "level": "Lv.1"
      },
      {
        "name": "龙神斩",
        "type": "火",
        "cost": 42,
        "desc": "给予单一敌人火属性斩攻击（极大）+ 自身力量UP（3回合）",
        "skillType": "战斗宣言"
      ,
        "level": "Lv.10"
      },
      {
        "name": "守护之誓",
        "type": "无",
        "cost": 18,
        "desc": "我方全体物理耐性UP（3回合）+ HP回复（小）",
        "skillType": "固有技能"
      ,
        "level": "Lv.1"
      }
    ],
    "starGuideAbilities": {
      "tenmei": [
        {
          "name": "HP最大値+100",
          "condition": "天值 5",
          "initialEffect": "HP上限增加100",
          "enhancedEffect": "HP上限增加200"
        },
        {
          "name": "HP最大値+200",
          "condition": "天值 15",
          "initialEffect": "HP上限增加200",
          "enhancedEffect": "HP上限增加400"
        },
        {
          "name": "腕力+10",
          "condition": "天值 30",
          "initialEffect": "腕力增加10",
          "enhancedEffect": "腕力增加20"
        },
        {
          "name": "物理暴击率+5%",
          "condition": "天值 50",
          "initialEffect": "物理暴击率提升5%",
          "enhancedEffect": "物理暴击率提升8%"
        },
        {
          "name": "HP最大値+400",
          "condition": "天值 75",
          "initialEffect": "HP上限增加400",
          "enhancedEffect": "HP上限增加600"
        },
        {
          "name": "全属性耐性+10%",
          "condition": "天值 105",
          "initialEffect": "全属性耐性提升10%",
          "enhancedEffect": "全属性耐性提升15%"
        },
        {
          "name": "腕力+20",
          "condition": "天值 140",
          "initialEffect": "腕力增加20",
          "enhancedEffect": "腕力增加30"
        },
        {
          "name": "物理暴击威力+30%",
          "condition": "天值 175",
          "initialEffect": "物理暴击威力提升30%",
          "enhancedEffect": "物理暴击威力提升50%"
        },
        {
          "name": "HP最大値+600",
          "condition": "天值 215",
          "initialEffect": "HP上限增加600",
          "enhancedEffect": "HP上限增加1000"
        },
        {
          "name": "物理暴击率+10%",
          "condition": "天值 255",
          "initialEffect": "物理暴击率提升10%",
          "enhancedEffect": "物理暴击率提升15%"
        }
      ],
      "abilityGain": [
        {
          "name": "星导觉醒",
          "unlock": "Lv.50",
          "initialEffect": "解锁星导系统",
          "enhancedEffect": "星导槽增加1格"
        },
        {
          "name": "能力解放·攻",
          "unlock": "Lv.60",
          "initialEffect": "物理攻击+15",
          "enhancedEffect": "物理攻击+30"
        },
        {
          "name": "能力解放·防",
          "unlock": "Lv.70",
          "initialEffect": "物理防御+15",
          "enhancedEffect": "物理防御+30"
        },
        {
          "name": "能力解放·极",
          "unlock": "Lv.80",
          "initialEffect": "物理攻击+30、速度+15",
          "enhancedEffect": "物理攻击+50、速度+30"
        }
      ],
      "burstEnhance": [
        {
          "name": "星导爆裂强化",
          "initialEffect": "龙神斩变化为「龙神破天」：给予全体敌人火属性斩攻击（极大）+ 自身力量UP（3回合）",
          "enhancedEffect": "龙神破天追加：暴击时伤害UP（3回合）"
        }
      ],
      "starSkills": [
        {
          "name": "星龙斩",
          "type": "火",
          "cost": 56,
          "normalState": "给予全体敌人火属性斩攻击（极大）+ 暴击时伤害UP（3回合）",
          "burstState": "给予全体敌人火属性斩攻击（极大）+ 暴击时伤害UP（5回合）+ 暴击率UP"
        }
      ]
    }
  },
  {
    "id": "qian",
    "name": "茜",
    "element": "水",
    "weapon": "刀",
    "stars": "4",
    "role": "剑士",
    "job": "流水剑圣",
    "title": "水之都的剑士",
    "form": "NS",
    "personality": ["剑士", "沉着冷静", "师寻之旅"],
    "lightShadow": "冥",
    "gender": "女",
    "starGuide": "未开放",
    "grasta": "水/刀",
    "tomeDrop": "时之塔-VH 第2层",
    "voiceActor": "早见沙织",
    "acquisition": "星梦池随机邂逅",
    "maxLv": "60",
    "hp": "3210",
    "mp": "385",
    "pAtk": "228",
    "pDef": "196",
    "mAtk": "158",
    "mDef": "152",
    "speed": "245",
    "description": "来自水之都市的女剑士，性格冷静沉着。",
    "skills": [
      {
        "name": "水流斩",
        "type": "水",
        "cost": 20,
        "desc": "给予单一敌人水属性斩攻击（大）",
        "skillType": "战斗宣言"
      ,
        "level": "Lv.30"
      },
      {
        "name": "冰华乱舞",
        "type": "水",
        "cost": 38,
        "desc": "给予随机敌人水属性斩攻击（特大·3次）",
        "skillType": "战斗宣言"
      ,
        "level": "Lv.50"
      },
      {
        "name": "水流壁",
        "type": "水",
        "cost": 15,
        "desc": "自身物理耐性UP（3回合）+ 速度UP（3回合）",
        "skillType": "固有技能"
      ,
        "level": "Lv.10"
      }
    ],
    "starGuideAbilities": {
      "tenmei": [
        {
          "name": "HP最大値+100",
          "condition": "天值 5",
          "initialEffect": "HP上限增加100",
          "enhancedEffect": "HP上限增加200"
        },
        {
          "name": "HP最大値+200",
          "condition": "天值 15",
          "initialEffect": "HP上限增加200",
          "enhancedEffect": "HP上限增加400"
        },
        {
          "name": "腕力+10",
          "condition": "天值 30",
          "initialEffect": "腕力增加10",
          "enhancedEffect": "腕力增加20"
        },
        {
          "name": "物理暴击率+5%",
          "condition": "天值 50",
          "initialEffect": "物理暴击率提升5%",
          "enhancedEffect": "物理暴击率提升8%"
        },
        {
          "name": "HP最大値+400",
          "condition": "天值 75",
          "initialEffect": "HP上限增加400",
          "enhancedEffect": "HP上限增加600"
        },
        {
          "name": "全属性耐性+10%",
          "condition": "天值 105",
          "initialEffect": "全属性耐性提升10%",
          "enhancedEffect": "全属性耐性提升15%"
        },
        {
          "name": "腕力+20",
          "condition": "天值 140",
          "initialEffect": "腕力增加20",
          "enhancedEffect": "腕力增加30"
        },
        {
          "name": "物理暴击威力+30%",
          "condition": "天值 175",
          "initialEffect": "物理暴击威力提升30%",
          "enhancedEffect": "物理暴击威力提升50%"
        },
        {
          "name": "HP最大値+600",
          "condition": "天值 215",
          "initialEffect": "HP上限增加600",
          "enhancedEffect": "HP上限增加1000"
        },
        {
          "name": "物理暴击率+10%",
          "condition": "天值 255",
          "initialEffect": "物理暴击率提升10%",
          "enhancedEffect": "物理暴击率提升15%"
        }
      ]
    }
  },
  {
    "id": "aimi",
    "name": "艾米",
    "element": "风",
    "weapon": "弓",
    "stars": "4",
    "role": "弓手",
    "job": "疾风射手",
    "title": "风之森的精灵",
    "form": "AS",
    "personality": ["精灵族", "弓手", "活泼开朗"],
    "lightShadow": "天",
    "gender": "女",
    "starGuide": "未开放",
    "grasta": "风/弓",
    "tomeDrop": "魔兽城-VH 第2层",
    "voiceActor": "悠木碧",
    "acquisition": "星梦池随机邂逅",
    "maxLv": "60",
    "hp": "2980",
    "mp": "412",
    "pAtk": "235",
    "pDef": "168",
    "mAtk": "172",
    "mDef": "145",
    "speed": "268",
    "description": "风之森的精灵族少女，拥有百发百中的弓术。",
    "skills": [
      {
        "name": "疾风箭",
        "type": "风",
        "cost": 18,
        "desc": "给予单一敌人风属性弓攻击（大）",
        "skillType": "战斗宣言"
      ,
        "level": "Lv.72"
      },
      {
        "name": "暴风骤雨",
        "type": "风",
        "cost": 35,
        "desc": "给予全体敌人风属性弓攻击（特大）",
        "skillType": "战斗宣言"
      ,
        "level": "Lv.72"
      },
      {
        "name": "精灵之眼",
        "type": "无",
        "cost": 12,
        "desc": "自身暴击率UP（3回合）+ 命中率UP（3回合）",
        "skillType": "固有技能"
      ,
        "level": "Lv.30"
      },
      {
        "name": "精准射击",
        "type": "风",
        "cost": 28,
        "desc": "给予单一敌人风属性弓攻击（极大·必定暴击）",
        "skillType": "习得技能"
      ,
        "level": "Lv.40"
      }
    ],
    "starGuideAbilities": {
      "tenmei": [
        {
          "name": "HP最大値+100",
          "condition": "天值 5",
          "initialEffect": "HP上限增加100",
          "enhancedEffect": "HP上限增加200"
        },
        {
          "name": "HP最大値+200",
          "condition": "天值 15",
          "initialEffect": "HP上限增加200",
          "enhancedEffect": "HP上限增加400"
        },
        {
          "name": "腕力+10",
          "condition": "天值 30",
          "initialEffect": "腕力增加10",
          "enhancedEffect": "腕力增加20"
        },
        {
          "name": "物理暴击率+5%",
          "condition": "天值 50",
          "initialEffect": "物理暴击率提升5%",
          "enhancedEffect": "物理暴击率提升8%"
        },
        {
          "name": "HP最大値+400",
          "condition": "天值 75",
          "initialEffect": "HP上限增加400",
          "enhancedEffect": "HP上限增加600"
        },
        {
          "name": "全属性耐性+10%",
          "condition": "天值 105",
          "initialEffect": "全属性耐性提升10%",
          "enhancedEffect": "全属性耐性提升15%"
        },
        {
          "name": "腕力+20",
          "condition": "天值 140",
          "initialEffect": "腕力增加20",
          "enhancedEffect": "腕力增加30"
        },
        {
          "name": "物理暴击威力+30%",
          "condition": "天值 175",
          "initialEffect": "物理暴击威力提升30%",
          "enhancedEffect": "物理暴击威力提升50%"
        },
        {
          "name": "HP最大値+600",
          "condition": "天值 215",
          "initialEffect": "HP上限增加600",
          "enhancedEffect": "HP上限增加1000"
        },
        {
          "name": "物理暴击率+10%",
          "condition": "天值 255",
          "initialEffect": "物理暴击率提升10%",
          "enhancedEffect": "物理暴击率提升15%"
        }
      ]
    }
  },
  {
    "id": "lika",
    "name": "莉卡",
    "element": "地",
    "weapon": "杖",
    "stars": "5",
    "role": "法师",
    "job": "地脉贤者",
    "title": "贤者后裔",
    "form": "ES",
    "personality": ["贤者后裔", "知识渊博", "诅咒"],
    "lightShadow": "天",
    "gender": "女",
    "starGuide": "已开放",
    "grasta": "地/杖",
    "tomeDrop": "异境-VH 第1层",
    "voiceActor": "水濑祈",
    "acquisition": "星梦池随机邂逅",
    "maxLv": "80",
    "hp": "2780",
    "mp": "568",
    "pAtk": "142",
    "pDef": "155",
    "mAtk": "268",
    "mDef": "245",
    "speed": "215",
    "description": "地之贤者的后裔，拥有强大的魔法力量。",
    "skills": [
      {
        "name": "大地之锤",
        "type": "地",
        "cost": 24,
        "desc": "给予单一敌人地属性魔法攻击（特大）",
        "skillType": "战斗宣言"
      ,
        "level": "Lv.72"
      },
      {
        "name": "陨石风暴",
        "type": "地",
        "cost": 48,
        "desc": "给予全体敌人地属性魔法攻击（极大）",
        "skillType": "战斗宣言"
      ,
        "level": "Lv.72"
      },
      {
        "name": "大地之盾",
        "type": "地",
        "cost": 20,
        "desc": "我方全体全属性耐性UP（3回合）",
        "skillType": "固有技能"
      ,
        "level": "Lv.30"
      },
      {
        "name": "魔力集中",
        "type": "无",
        "cost": 12,
        "desc": "自身魔法攻击UP（大·3回合）",
        "skillType": "习得技能"
      ,
        "level": "Lv.55"
      }
    ],
    "starGuideAbilities": {
      "tenmei": [
        {
          "name": "MP最大値+20",
          "condition": "天值 5",
          "initialEffect": "MP上限增加20",
          "enhancedEffect": "MP上限增加40"
        },
        {
          "name": "MP最大値+40",
          "condition": "天值 15",
          "initialEffect": "MP上限增加40",
          "enhancedEffect": "MP上限增加80"
        },
        {
          "name": "知性+10",
          "condition": "天值 30",
          "initialEffect": "知性增加10",
          "enhancedEffect": "知性增加20"
        },
        {
          "name": "魔法暴击率+5%",
          "condition": "天值 50",
          "initialEffect": "魔法暴击率提升5%",
          "enhancedEffect": "魔法暴击率提升8%"
        },
        {
          "name": "MP最大値+80",
          "condition": "天值 75",
          "initialEffect": "MP上限增加80",
          "enhancedEffect": "MP上限增加120"
        },
        {
          "name": "全属性耐性+10%",
          "condition": "天值 105",
          "initialEffect": "全属性耐性提升10%",
          "enhancedEffect": "全属性耐性提升15%"
        },
        {
          "name": "知性+20",
          "condition": "天值 140",
          "initialEffect": "知性增加20",
          "enhancedEffect": "知性增加30"
        },
        {
          "name": "魔法暴击威力+30%",
          "condition": "天值 175",
          "initialEffect": "魔法暴击威力提升30%",
          "enhancedEffect": "魔法暴击威力提升50%"
        },
        {
          "name": "MP最大値+120",
          "condition": "天值 215",
          "initialEffect": "MP上限增加120",
          "enhancedEffect": "MP上限增加200"
        },
        {
          "name": "魔法暴击率+10%",
          "condition": "天值 255",
          "initialEffect": "魔法暴击率提升10%",
          "enhancedEffect": "魔法暴击率提升15%"
        }
      ],
      "abilityGain": [
        {
          "name": "星导觉醒",
          "unlock": "Lv.50",
          "initialEffect": "解锁星导系统",
          "enhancedEffect": "星导槽增加1格"
        },
        {
          "name": "能力解放·攻",
          "unlock": "Lv.60",
          "initialEffect": "魔法攻击+15",
          "enhancedEffect": "魔法攻击+30"
        },
        {
          "name": "能力解放·防",
          "unlock": "Lv.70",
          "initialEffect": "魔法防御+15",
          "enhancedEffect": "魔法防御+30"
        },
        {
          "name": "能力解放·极",
          "unlock": "Lv.80",
          "initialEffect": "魔法攻击+30、MP+40",
          "enhancedEffect": "魔法攻击+50、MP+80"
        }
      ],
      "burstEnhance": [
        {
          "name": "星导爆裂强化",
          "initialEffect": "陨石风暴变化为「星尘风暴」：给予全体敌人地属性魔法攻击（极大）+ 自身知性UP（3回合）",
          "enhancedEffect": "星尘风暴追加：魔法暴击时伤害UP（3回合）"
        }
      ],
      "starSkills": [
        {
          "name": "星尘之雨",
          "type": "地",
          "cost": 58,
          "normalState": "给予全体敌人地属性魔法攻击（极大）+ 魔法暴击时伤害UP（3回合）",
          "burstState": "给予全体敌人地属性魔法攻击（极大）+ 魔法暴击时伤害UP（5回合）+ 知性UP"
        }
      ]
    }
  },
  {
    "id": "saiwen",
    "name": "塞温",
    "element": "雷",
    "weapon": "枪",
    "stars": "5",
    "role": "骑士",
    "job": "雷光将军",
    "title": "最强骑士团长",
    "form": "AC",
    "personality": ["前骑士团长", "正义感", "复仇者"],
    "lightShadow": "天",
    "gender": "男",
    "starGuide": "已开放",
    "grasta": "雷/枪",
    "tomeDrop": "虚空领域-VH 第1层",
    "voiceActor": "中村悠一",
    "acquisition": "星梦池随机邂逅",
    "maxLv": "80",
    "hp": "3890",
    "mp": "365",
    "pAtk": "258",
    "pDef": "252",
    "mAtk": "148",
    "mDef": "198",
    "speed": "198",
    "description": "曾是最强骑士团的团长，被称作「雷光将军」。",
    "skills": [
      {
        "name": "雷光突",
        "type": "雷",
        "cost": 20,
        "desc": "给予单一敌人雷属性突攻击（大）",
        "skillType": "战斗宣言"
      ,
        "level": "Lv.72"
      },
      {
        "name": "雷霆万钧",
        "type": "雷",
        "cost": 44,
        "desc": "给予全体敌人雷属性突攻击（特大）+ 自身力量UP",
        "skillType": "战斗宣言"
      ,
        "level": "Lv.72"
      },
      {
        "name": "铁壁防御",
        "type": "无",
        "cost": 16,
        "desc": "自身物理耐性UP（大·3回合）+ HP自动回复",
        "skillType": "固有技能"
      ,
        "level": "Lv.30"
      }
    ],
    "starGuideAbilities": {
      "tenmei": [
        {
          "name": "HP最大値+100",
          "condition": "天值 5",
          "initialEffect": "HP上限增加100",
          "enhancedEffect": "HP上限增加200"
        },
        {
          "name": "HP最大値+200",
          "condition": "天值 15",
          "initialEffect": "HP上限增加200",
          "enhancedEffect": "HP上限增加400"
        },
        {
          "name": "腕力+10",
          "condition": "天值 30",
          "initialEffect": "腕力增加10",
          "enhancedEffect": "腕力增加20"
        },
        {
          "name": "物理暴击率+5%",
          "condition": "天值 50",
          "initialEffect": "物理暴击率提升5%",
          "enhancedEffect": "物理暴击率提升8%"
        },
        {
          "name": "HP最大値+400",
          "condition": "天值 75",
          "initialEffect": "HP上限增加400",
          "enhancedEffect": "HP上限增加600"
        },
        {
          "name": "全属性耐性+10%",
          "condition": "天值 105",
          "initialEffect": "全属性耐性提升10%",
          "enhancedEffect": "全属性耐性提升15%"
        },
        {
          "name": "腕力+20",
          "condition": "天值 140",
          "initialEffect": "腕力增加20",
          "enhancedEffect": "腕力增加30"
        },
        {
          "name": "物理暴击威力+30%",
          "condition": "天值 175",
          "initialEffect": "物理暴击威力提升30%",
          "enhancedEffect": "物理暴击威力提升50%"
        },
        {
          "name": "HP最大値+600",
          "condition": "天值 215",
          "initialEffect": "HP上限增加600",
          "enhancedEffect": "HP上限增加1000"
        },
        {
          "name": "物理暴击率+10%",
          "condition": "天值 255",
          "initialEffect": "物理暴击率提升10%",
          "enhancedEffect": "物理暴击率提升15%"
        }
      ],
      "abilityGain": [
        {
          "name": "星导觉醒",
          "unlock": "Lv.50",
          "initialEffect": "解锁星导系统",
          "enhancedEffect": "星导槽增加1格"
        },
        {
          "name": "能力解放·攻",
          "unlock": "Lv.60",
          "initialEffect": "物理攻击+15",
          "enhancedEffect": "物理攻击+30"
        },
        {
          "name": "能力解放·防",
          "unlock": "Lv.70",
          "initialEffect": "物理防御+15",
          "enhancedEffect": "物理防御+30"
        },
        {
          "name": "能力解放·极",
          "unlock": "Lv.80",
          "initialEffect": "物理攻击+30、速度+15",
          "enhancedEffect": "物理攻击+50、速度+30"
        }
      ],
      "burstEnhance": [
        {
          "name": "星导爆裂强化",
          "initialEffect": "雷霆万钧变化为「万雷奔騰」：给予全体敌人雷属性突攻击（极大）+ 自身力量UP（3回合）",
          "enhancedEffect": "万雷奔騰追加：暴击时伤害UP（3回合）"
        }
      ],
      "starSkills": [
        {
          "name": "星雷枪",
          "type": "雷",
          "cost": 54,
          "normalState": "给予全体敌人雷属性突攻击（极大）+ 暴击时伤害UP（3回合）",
          "burstState": "给予全体敌人雷属性突攻击（极大）+ 暴击时伤害UP（5回合）+ 暴击率UP"
        }
      ]
    }
  }
]