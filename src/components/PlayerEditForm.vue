<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  VBtn,
  VCard,
  VCardSubtitle,
  VCardText,
  VCheckbox,
  VChip,
  VForm,
  VIcon,
  VList,
  VListItem,
  VMenu,
  VSelect,
  VTextField
} from 'vuetify/components';
import type { Player } from '~/types';
import {
  EmergencyFightScores,
  SpecialEventScores,
  WonderlandScores,
  difficultyBase
} from '~/utils';
import { createNewPlayer } from '~/utils/player';

const props = defineProps<{ player?: Player }>();
const emit = defineEmits<{
  (e: 'updatePlayer', player: Player): void;
  (e: 'cancleEdit'): void;
}>();

const difficulties = Reflect.ownKeys(difficultyBase).map(k => ({
  value: parseInt(String(k)),
  title: `${String(k)} (x${(difficultyBase as any)[parseInt(String(k))]})`
}));

const form = ref({ ...(props.player ?? createNewPlayer()) });

watch(
  () => props.player,
  () => {
    form.value = { ...(props.player ?? createNewPlayer()) };
  }
);
</script>

<template>
  <VForm>
    <VTextField v-model="form.name" type="text" label="昵称"></VTextField>

    <VSelect
      v-model="form.difficulty"
      label="难度系数"
      :items="difficulties"
      item-title="title"
      item-value="value"
    ></VSelect>

    <VSelect
      v-model="form.levels"
      label="通关层数"
      :items="[1, 2, 3, 4, 5]"
    ></VSelect>

    <div grid grid-cols-3 gap="2">
      <VTextField
        v-model.number="form.collections"
        type="number"
        label="收藏品数量"
      ></VTextField>

      <VTextField
        v-model.number="form.tacticalItems"
        type="number"
        label="战术道具数量"
      ></VTextField>

      <VTextField
        v-model.number="form.negativeCollections"
        type="number"
        label="负面藏品数量"
      ></VTextField>
    </div>

    <VSelect
      v-model="form.endingBoss"
      label="Boss 路线"
      :items="[
        { name: 'knight', title: '骑士' },
        { name: 'mizuki', title: '水月' },
        { name: 'skadi', title: '大蒂' }
      ]"
      item-title="title"
      item-value="name"
    ></VSelect>

    <VCard v-if="form.endingBoss === 'knight'" my="sm" variant="outlined">
      <div grid grid-cols-2>
        <VCheckbox
          v-model="form.clearKnightWithfragile"
          label="带脆弱通关骑士"
          hide-details
        ></VCheckbox>
        <VCheckbox
          v-model="form.knightDead"
          label="骑士死亡"
          hide-details
        ></VCheckbox>
      </div>
    </VCard>

    <div>
      <span class="v-label" px="2" pb="1" text="sm">白嫖干员数量</span>
      <div grid grid-cols-3 gap="sm">
        <VTextField
          v-model="form.obtainedCharaters.six"
          type="number"
          label="六星"
        ></VTextField>
        <VTextField
          v-model="form.obtainedCharaters.five"
          type="number"
          label="五星"
        ></VTextField>
        <VTextField
          v-model="form.obtainedCharaters.four"
          type="number"
          label="四星"
        ></VTextField>
      </div>
    </div>

    <div my="sm">
      <span class="v-label" text="sm" px="2" pb="1">误入奇境</span>
      <div flex flex-wrap gap="2">
        <VChip
          v-for="(item, index) in form.wonderlands"
          :key="JSON.stringify(item)"
          closable
          @click:close="form.wonderlands.splice(index, 1)"
        >
          {{ item.name }}
        </VChip>

        <VMenu>
          <template #activator="{ props: activatorProps }">
            <VChip color="primary" v-bind="activatorProps">
              <VIcon icon="mdi-plus"></VIcon>
            </VChip>
          </template>

          <VList>
            <VListItem
              v-for="item in WonderlandScores"
              :key="item.name"
              :value="item.name"
              @click="form.wonderlands.push(item)"
            >
              {{ item.name }}
            </VListItem>
          </VList>
        </VMenu>
      </div>
    </div>

    <VTextField
      v-model.number="form.buff"
      type="number"
      label="启示数量"
    ></VTextField>

    <div my="sm">
      <span class="v-label" text="sm" px="2" pb="1">委托数量</span>
      <div grid grid-cols-3 gap="sm">
        <VCard variant="outlined" pt="2">
          <VCardSubtitle>困难</VCardSubtitle>
          <VCardText>
            <VTextField
              v-model.number="form.delegateTasks.hard.over7level"
              type="number"
              label="超过七层"
            ></VTextField>
            <VTextField
              v-model.number="form.delegateTasks.hard.normal"
              type="number"
              label="普通"
            ></VTextField>
          </VCardText>
        </VCard>

        <VCard variant="outlined" pt="2">
          <VCardSubtitle>有点难</VCardSubtitle>
          <VCardText>
            <VTextField
              v-model.number="form.delegateTasks.slightlyHard.over7level"
              type="number"
              label="超过七层"
            ></VTextField>
            <VTextField
              v-model.number="form.delegateTasks.slightlyHard.normal"
              type="number"
              label="普通"
            ></VTextField>
          </VCardText>
        </VCard>

        <VCard variant="outlined" pt="2">
          <VCardSubtitle>简单</VCardSubtitle>
          <VCardText>
            <VTextField
              v-model.number="form.delegateTasks.easy.over7level"
              type="number"
              label="超过七层"
            ></VTextField>
            <VTextField
              v-model.number="form.delegateTasks.easy.normal"
              type="number"
              label="普通"
            ></VTextField>
          </VCardText>
        </VCard>
      </div>
    </div>

    <VTextField
      v-model.number="form.perfectBattle"
      type="number"
      label="战斗节点目标生命+护盾值不掉次数"
    ></VTextField>

    <div my="sm">
      <span class="v-label" text="sm" px="2" pb="1">紧急作战</span>
      <div flex flex-wrap gap="2">
        <VChip
          v-for="(item, index) in form.highDifficultyEmergencyFight"
          :key="JSON.stringify(item)"
          closable
          @click:close="form.highDifficultyEmergencyFight.splice(index, 1)"
        >
          {{ item.name }}
        </VChip>

        <VMenu>
          <template #activator="{ props: activatorProps }">
            <VChip color="primary" v-bind="activatorProps">
              <VIcon icon="mdi-plus"></VIcon>
            </VChip>
          </template>

          <VList>
            <VListItem
              v-for="item in EmergencyFightScores"
              :key="item.name"
              :value="item.name"
              @click="form.highDifficultyEmergencyFight.push(item)"
            >
              {{ item.name }}
            </VListItem>
          </VList>
        </VMenu>
      </div>
    </div>

    <div my="sm">
      <span class="v-label" text="sm" px="2" pb="1">特殊事件结点</span>
      <div flex flex-wrap gap="2">
        <VChip
          v-for="(item, index) in form.specialEvents"
          :key="JSON.stringify(item)"
          closable
          @click:close="form.specialEvents.splice(index, 1)"
        >
          {{ item.name }}
        </VChip>

        <VMenu>
          <template #activator="{ props: activatorProps }">
            <VChip color="primary" v-bind="activatorProps">
              <VIcon icon="mdi-plus"></VIcon>
            </VChip>
          </template>

          <VList>
            <VListItem
              v-for="item in SpecialEventScores"
              :key="item.name"
              :value="item.name"
              @click="form.specialEvents.push(item)"
            >
              {{ item.name }}
            </VListItem>
          </VList>
        </VMenu>
      </div>
    </div>

    <VCard variant="outlined" my="sm">
      <VCardSubtitle pt="sm">特殊宝箱</VCardSubtitle>
      <VCardText grid grid-cols-2 gap="2">
        <VTextField
          v-model.number="form.treasureChest.spike"
          type="number"
          label="尖刺"
        ></VTextField>
        <VTextField
          v-model.number="form.treasureChest.fish"
          type="number"
          label="恐鱼"
        ></VTextField>
      </VCardText>
    </VCard>

    <div grid grid-cols-3 gap="2">
      <VTextField
        v-model.number="form.killedAnimals"
        type="number"
        label="关卡最后出现鸭子，熊，狗时，成功击杀次数"
      ></VTextField>

      <VTextField
        v-model.number="form.specialBonus"
        type="number"
        label="触发特殊奖励次数"
      ></VTextField>

      <VTextField
        v-model.number="form.comfortBonus"
        type="number"
        label="触发安慰奖励次数"
      ></VTextField>

      <VTextField
        v-model.number="form.comfortBonus"
        type="number"
        label="触发安慰奖励次数"
      ></VTextField>

      <VTextField
        v-model.number="form.reducedHp"
        type="number"
        label="Boss 关卡外生命值降低"
      ></VTextField>

      <VTextField
        v-model.number="form.getMoneyExceeds12"
        type="number"
        label="取钱一次性超过 12"
      ></VTextField>
    </div>

    <div grid grid-cols-2 gap="2">
      <VBtn color="primary" @click="emit('updatePlayer', { ...form })">
        提交
      </VBtn>
      <VBtn @click="emit('cancleEdit')">取消</VBtn>
    </div>
  </VForm>
</template>

<style scoped></style>
