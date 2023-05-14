<script setup lang="ts">
import { VBtn, VCard, VContainer } from 'vuetify/components';
import { remove } from 'lodash-es';
import PlayersTable from '~/components/PlayersTable.vue';
import { usePlayerState } from '~/state';
import type { Player } from '~/types';
import { Swal } from '~/utils';
import { createNewPlayer } from '~/utils/player';
import PlayerEditForm from '~/components/PlayerEditForm.vue';

const players = usePlayerState();

function appendNewPlayer(initValue: Omit<Partial<Player>, 'id'> = {}) {
  players.value.push(createNewPlayer(initValue));
}

function handleDeletePlayer(id: string) {
  Swal.fire({
    title: '确定要删除这条记录吗？',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(res => {
    if (res.isConfirmed) {
      remove(players.value, player => player.id === id);
    }
  });
}
</script>

<template>
  <VContainer>
    <VCard pb="xl">
      <VBtn @click="appendNewPlayer">添加</VBtn>
      <PlayersTable
        :players="players"
        @delete-player="id => handleDeletePlayer(id)"
      ></PlayersTable>
    </VCard>

    <PlayerEditForm w="540px" mx="auto" mt="xl"></PlayerEditForm>
  </VContainer>
</template>

<style scoped></style>
