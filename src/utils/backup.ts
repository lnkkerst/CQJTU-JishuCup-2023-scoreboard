import { Base64 } from 'js-base64';
import { gzip, ungzip } from 'pako';
import { saveAs } from 'file-saver';
import { calculateScore, difficultyBase } from '.';
import type { Player } from '~/types';

export function exportJson(players: Player[]): string {
  return Base64.fromUint8Array(gzip(JSON.stringify(players)));
}

export function importJson(raw: string): Player[] {
  return JSON.parse(ungzip(Base64.toUint8Array(raw), { to: 'string' }));
}

export function exportCsv(players: Player[], details = false) {
  let res = '';
  if (details) {
    res =
      '刀客塔,难度系数,基础分数,额外分数,总分数,通关层数,收藏品数量,战术道具数量,负面藏品数量,Boss路线,是否选择骑士路线,带脆弱通关骑士,骑士死亡,白嫖六星干员,白嫖五星干员,白嫖四星干员,误入奇境,启示数量,困难委托,稍难委托,简单委托,完美作战次数,紧急作战,特殊事件节点,尖刺宝箱,恐鱼宝箱,击杀小动物,特殊奖励,安慰奖励,Boss关外生命值降低,取钱超12';

    players.forEach(player => {
      const score = calculateScore(player);

      let wonderlandStr = '';
      player.wonderlands.forEach(
        item =>
          (wonderlandStr = `${wonderlandStr}[${item.name} (+${item.score})]`)
      );

      let emergencyBattleStr = '';
      player.highDifficultyEmergencyFight.forEach(
        item =>
          (emergencyBattleStr = `${emergencyBattleStr}[${item.name} (+${item.score})]`)
      );

      let specialEventStr = '';
      player.specialEvents.forEach(
        item =>
          (specialEventStr = `${specialEventStr}[${item.name} (+${item.score})]`)
      );

      res = `${res}\n${player.name},${player.difficulty} (x${
        (difficultyBase as any)[player.difficulty]
      }),${score.baseScore},${score.extraScore},${score.score},${
        player.levels
      },${player.collections},${player.tacticalItems},${
        player.negativeCollections
      },${player.endingBoss},${player.withKnight},${
        player.clearKnightWithfragile
      },${player.knightDead},${player.obtainedCharaters.six},${
        player.obtainedCharaters.five
      },${player.obtainedCharaters.four},${wonderlandStr},${player.buff},${
        player.delegateTasks.hard.normal
      },${player.delegateTasks.slightlyHard.normal}, ${
        player.delegateTasks.easy.normal
      },${player.perfectBattle},${emergencyBattleStr},${specialEventStr},${
        player.treasureChest.spike
      },${player.treasureChest.fish},${player.killedAnimals},${
        player.specialBonus
      },${player.comfortBonus},${player.reducedHp},${player.getMoneyExceeds12}`;
    });
  } else {
    res = '刀客塔,难度系数,基础分数,额外分数,总分数';
    players.forEach(player => {
      const score = calculateScore(player);
      res = `${res}\n${player.name},${player.difficulty} (x${
        (difficultyBase as any)[player.difficulty]
      }),${score.baseScore},${score.extraScore},${score.score}`;
    });
  }
  const fileName = `result${details ? '_detailed' : ''}_${Date.now()}.csv`;
  saveAs(new Blob([res], { type: 'text/csv;charset=utf-8' }), fileName);
}
