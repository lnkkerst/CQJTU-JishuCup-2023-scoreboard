/**
 * 结局 Boss 类型
 *
 * @type EndingBoss
 */
export type EndingBoss = 'knight' | 'mizuki' | 'skadi';

/**
 * 紧急作战
 *
 * @interface EmergencyFight
 */
export interface EmergencyFight {
  name: string;
  score: number;
}

/**
 * 特殊事件加分项目
 *
 * @interface SpecialEvent
 */
export interface SpecialEvent {
  name: string;
  score: number;
}

/**
 * 误入奇境
 *
 * @interface Wonderland
 */
export interface Wonderland {
  name: string;
  score: number;
}

/**
 * 玩家和记录
 *
 * @interface Player
 */
export interface Player {
  /** 玩家 ID */
  id: string;
  /** 玩家昵称 */
  name: string;
  /** 层数 */
  levels: number;
  /** 难度系数 */
  difficulty: number;
  /** 收藏品 */
  collections: number;
  /** 战术道具 */
  tacticalItems: number;
  /** 负面藏品 */
  negativeCollections: number;
  /** 结局类型 */
  endingBoss: EndingBoss;
  /** 误入奇境 */
  wonderlands: Wonderland[];
  /** 白嫖干员 */
  obtainedCharaters: {
    six: number;
    five: number;
    four: number;
  };
  /** 启示 */
  buff: number;
  /** 委托 */
  delegateTasks: {
    hard: {
      over7level: number;
      normal: number;
    };
    slightlyHard: {
      over7level: number;
      normal: number;
    };
    easy: {
      over7level: number;
      normal: number;
    };
  };
  /** 战斗节点目标生命+护盾值不掉 */
  perfectBattle: number;
  /** 走骑士路线时带脆弱通关结局 */
  clearKnightWithfragile: boolean;
  /** 紧急作战 */
  highDifficultyEmergencyFight: EmergencyFight[];
  /** 特殊事件结点达成条件 */
  specialEvents: SpecialEvent[];
  /** 关卡最后出现鸭子，熊，狗时，成功击杀 */
  killedAnimals: number;
  /** 特殊宝箱 */
  treasureChest: {
    spike: number;
    fish: number;
  };
  /** 特殊奖励 */
  specialBonus: number;
  /** 安慰奖励 */
  comfortBonus: number;
  /** 选择骑士结局时，骑士死亡 */
  knightDead: boolean;
  /** boss 关卡外生命值降低 */
  reducedHp: number;
  /** 取钱一次超过12 */
  getMoneyExceeds12: number;
}
