<script setup lang="ts">
import { computed, reactive } from 'vue';
import { VDataTable } from 'vuetify/labs/components';
import { VBtn } from 'vuetify/components';
import type { Player } from '~/types';
import { calculateScore } from '~/utils';

const props = defineProps<{ players: Player[]; search?: string }>();
const emit = defineEmits<{
  (e: 'modifyPlayer', id: string): void;
  (e: 'deletePlayer', id: string): void;
}>();

const headers = reactive([
  { key: 'name', title: '刀客塔' },
  { key: 'baseScore', title: '基础分数' },
  { key: 'difficulty', title: '难度系数' },
  { key: 'extraScore', title: '额外分数' },
  { key: 'score', title: '总分' },
  { key: 'operation', title: '操作', sortable: false }
]);

const playerScores = computed(() =>
  props.players.map(player => ({
    id: player.id,
    name: player.name,
    difficulty: player.difficulty,
    ...calculateScore(player)
  }))
);
</script>

<template>
  <div>
    <VDataTable
      :headers="headers"
      :items="playerScores"
      items-per-page="-1"
      :search="props.search"
    >
      <template #[`item.operation`]="{ item }">
        <VBtn
          icon="mdi-pencil"
          size="x-small"
          color="primary"
          @click="emit('modifyPlayer', item.raw.id)"
        ></VBtn>
        <VBtn
          icon="mdi-delete"
          size="x-small"
          color="error"
          ml="xs"
          @click="emit('deletePlayer', item.raw.id)"
        ></VBtn>
      </template>
    </VDataTable>
  </div>
</template>

<style scoped></style>
