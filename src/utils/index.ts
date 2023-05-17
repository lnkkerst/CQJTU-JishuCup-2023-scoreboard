import { sum } from 'lodash-es';
import type { Player } from '~/types';

export { Toast, Swal } from './swal';

export const LevelScores = [100, 150, 200, 250, 300];
export const bossScores = { mizuki: 350, skadi: 250, highmore: 0 };
export const difficultyBase = {
  0: 0.4,
  1: 0.5,
  2: 0.6,
  3: 0.7,
  4: 0.8,
  5: 0.9,
  6: 1.0,
  7: 1.2,
  8: 1.3,
  9: 1.4,
  10: 1.6,
  11: 1.8,
  12: 1.9,
  13: 2.0,
  14: 2.2,
  15: 2.4
};

export const WonderlandScores = [
  { name: '墓碑', score: 200 },
  { name: '寒灾', score: 150 },
  { name: '锈锤', score: 120 }
];

export const EmergencyFightScores = [
  { name: '巢穴', score: 30 },
  { name: '领地意识', score: 100 },
  { name: '铳与秩序', score: 40 },
  { name: '失控', score: 120 },
  { name: '好梦在何方', score: 90 },
  { name: '机械之灾', score: 50 },
  { name: '深度认知', score: 80 },
  { name: '瞻前顾后', score: 40 },
  { name: '狩猎场', score: 50 },
  { name: '溟痕乐园（无漏）', score: 40 },
  { name: '育生池', score: 80 },
  { name: '余烬方阵', score: 80 },
  { name: '水火相容', score: 140 },
  { name: '互助（无漏，且盾卫未死亡）', score: 40 }
];

export const SpecialEventScores = [
  { name: '建工现场（击杀鸭子）', score: 30 },
  { name: '真相（通关）', score: 50 },
  { name: '真相（无漏）', score: 100 },
  { name: '摸腿（通关）', score: 50 },
  { name: '摸腿（无漏）', score: 100 },
  { name: '鸭本运作（通关）', score: 60 },
  { name: '狂信如火（无漏）', score: 50 }
];

export function calculateScore(player: Player) {
  let baseScore = 0;
  let extraScore = 0;

  baseScore += sum(LevelScores.slice(0, player.levels));

  const clearLevel = player.levels > 4.5;

  extraScore += (player.collections + player.tacticalItems) * 15;

  extraScore += player.negativeCollections * 30;

  if (clearLevel) {
    baseScore += bossScores[player.endingBoss];
  }

  for (const item of player.wonderlands) {
    baseScore += item.score;
  }

  extraScore += player.obtainedCharaters.six * 40;
  extraScore += player.obtainedCharaters.five * 20;
  extraScore += player.obtainedCharaters.six * 10;

  extraScore += player.buff * 50;

  // extraScore += player.delegateTasks.hard.over7level * 80;
  extraScore += player.delegateTasks.hard.normal * 30;
  // extraScore += player.delegateTasks.slightlyHard.over7level * 50;
  extraScore += player.delegateTasks.slightlyHard.normal * 20;
  if (player.difficulty > 6.5) {
    extraScore += player.delegateTasks.hard.normal * 80;
    extraScore += player.delegateTasks.slightlyHard.normal * 50;
  }

  {
    let scoreBase = 20;
    if (Math.abs(player.difficulty - 10) < 1e-7 || player.difficulty < 10) {
      scoreBase = 10;
    }
    if (Math.abs(player.difficulty - 6) < 1e-7 || player.difficulty < 6) {
      scoreBase = 0;
    }
    extraScore += scoreBase * player.perfectBattle;
  }

  if (player.withKnight) {
    if (!player.knightDead && player.levels > 4.5) {
      baseScore += 450;

      if (player.clearKnightWithfragile) {
        const { difficulty } = player;
        if (difficulty > 4.5 && difficulty < 6.5) {
          extraScore += 50;
        }
        if (difficulty > 6.5) {
          extraScore += 80;
        }
        if (difficulty > 10.5) {
          extraScore += 50;
        }
      }
    }

    if (player.knightDead) {
      baseScore -= 30;
    }
  }

  if (player.difficulty > 7.5) {
    for (const item of player.highDifficultyEmergencyFight) {
      extraScore += item.score;
    }
  }

  for (const item of player.specialEvents) {
    extraScore += item.score;
  }

  extraScore += player.killedAnimals * 20;

  extraScore += player.treasureChest.spike * 10;
  extraScore += player.treasureChest.fish * 20;

  extraScore += player.specialBonus * 10;

  extraScore += player.comfortBonus * 50;

  if (player.difficulty > 0.5 && player.difficulty < 6.5) {
    extraScore -= player.reducedHp * 10;
  }

  extraScore -= player.getMoneyExceeds12 * 20;

  baseScore = Math.floor(baseScore + 0.5);
  extraScore = Math.floor(extraScore + 0.5);
  const score = Math.floor(
    // @ts-expect-error: key may out of range
    ((baseScore * difficultyBase[player.difficulty]) as number) + extraScore
  );

  return {
    baseScore,
    extraScore,
    score
  };
}
