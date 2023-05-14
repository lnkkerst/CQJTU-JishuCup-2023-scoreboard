import { v4 as uuidv4 } from 'uuid';
import type { Player } from '~/types';

export function createNewPlayer(
  initValue: Omit<Partial<Player>, 'id'> = {}
): Player {
  return {
    name: '',
    levels: 0,
    difficulty: 0,
    collections: 0,
    tacticalItems: 0,
    negativeCollections: 0,
    endingBoss: 'knight',
    wonderlands: [],
    obtainedCharaters: { six: 0, five: 0, four: 0 },
    buff: 0,
    delegateTasks: {
      hard: { over7level: 0, normal: 0 },
      slightlyHard: { over7level: 0, normal: 0 },
      easy: { over7level: 0, normal: 0 }
    },
    perfectBattle: 0,
    clearKnightWithfragile: false,
    highDifficultyEmergencyFight: [],
    specialEvents: [],
    killedAnimals: 0,
    treasureChest: { spike: 0, fish: 0 },
    specialBonus: 0,
    comfortBonus: 0,
    knightDead: false,
    reducedHp: 0,
    getMoneyExceeds12: 0,
    ...initValue,
    id: uuidv4()
  };
}
