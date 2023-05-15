<script setup lang="ts">
import {
  VBtn,
  VCard,
  VCardText,
  VContainer,
  VDialog,
  VList,
  VListItem,
  VListItemTitle,
  VMenu,
  VTextField,
  VTextarea
} from 'vuetify/components';
import { remove } from 'lodash-es';
import { ref } from 'vue';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue';
import PlayersTable from '~/components/PlayersTable.vue';
import { usePlayerState } from '~/state';
import { Swal, Toast } from '~/utils';
import { exportJson, importJson } from '~/utils/backup';
import { createNewPlayer } from '~/utils/player';
import PlayerEditForm from '~/components/PlayerEditForm.vue';
import type { Player } from '~/types';

const players = usePlayerState();
const editPlayer = ref(createNewPlayer());
const dialog = ref(false);
const search = ref('');
const textDialog = ref({
  open: false,
  content: '',
  restore: false
});

function handleAddNewPlayer() {
  const newPlayer = createNewPlayer();
  players.value.push(newPlayer);
  editPlayer.value = newPlayer;
  dialog.value = true;
}

function handleUpdatePlayer(player: Player) {
  const toBeEdited = players.value.findIndex(val => val.id === player.id);
  if (toBeEdited === -1) {
    return;
  }
  players.value[toBeEdited] = { ...player };
  dialog.value = false;
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

function handleModifyPlayer(id: string) {
  const toBeEdited = players.value.findIndex(val => val.id === id);
  if (toBeEdited === -1) {
    return;
  }
  editPlayer.value = { ...players.value[toBeEdited] };
  dialog.value = true;
}

function handleExportJson() {
  textDialog.value.content = exportJson(players.value);
  textDialog.value.restore = false;
  textDialog.value.open = true;
}

function handleImportJson() {
  textDialog.value.content = '';
  textDialog.value.restore = true;
  textDialog.value.open = true;
}

function importPlayers(
  mergePlayers: Player[] | string,
  { merge = false } = {}
) {
  try {
    if (typeof mergePlayers === 'string') {
      mergePlayers = importJson(mergePlayers);
    }
    if (merge) {
      const b = new Set(players.value.map(val => val.id));
      const newPlayers = [...players.value];
      mergePlayers.forEach(val => {
        if (!b.has(val.id)) {
          b.add(val.id);
          newPlayers.push({ ...val });
        }
      });
      players.value = newPlayers;
    } else {
      players.value = mergePlayers;
    }
  } catch (e) {
    Toast.fire({ title: '导入失败', icon: 'error' });
  }
}
</script>

<template>
  <VContainer>
    <div>
      <div flex items-center gap="8">
        <div flex items-center gap="2">
          <VBtn color="primary" @click="handleAddNewPlayer">添加</VBtn>
          <VMenu>
            <template #activator="{ props: activatorProps }">
              <VBtn color="primary" v-bind="activatorProps">备份还原</VBtn>
            </template>

            <VList>
              <VListItem @click="handleExportJson">
                <VListItemTitle>导出(JSON)</VListItemTitle>
              </VListItem>
              <VListItem @click="handleImportJson">
                <VListItemTitle>导入(JSON)</VListItemTitle>
              </VListItem>
              <VListItem @click="Toast.fire({ title: '还没写', icon: 'info' })">
                <VListItemTitle>导出(CSV)</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </div>

        <VTextField
          v-model="search"
          append-icon="mdi-magnify"
          label="搜索"
          density="compact"
          variant="outlined"
          single-line
          hide-details
        ></VTextField>
      </div>

      <VCard pb="xl" mt="xl">
        <PlayersTable
          :players="players"
          :search="search"
          @delete-player="id => handleDeletePlayer(id)"
          @modify-player="id => handleModifyPlayer(id)"
        ></PlayersTable>
      </VCard>
    </div>

    <VDialog v-model="dialog" persistent width="auto">
      <VCard w="4/5" max-w="720px" min-w="540px">
        <OverlayScrollbarsComponent>
          <VCardText>
            <PlayerEditForm
              :player="editPlayer"
              mt="xl"
              @update-player="handleUpdatePlayer"
              @cancle-edit="dialog = false"
            ></PlayerEditForm>
          </VCardText>
        </OverlayScrollbarsComponent>
      </VCard>
    </VDialog>

    <VDialog v-model="textDialog.open" close-on-back width="auto">
      <VCard w="4/5" max-w="540px" min-w="360px">
        <OverlayScrollbarsComponent
          :options="{ scrollbars: { autoHide: 'move' } }"
        >
          <VCardText>
            <VTextarea
              v-model="textDialog.content"
              variant="outlined"
              hide-details
              aria-selected
              auto-grow
            ></VTextarea>

            <div v-if="textDialog.restore" flex justify-center gap="4" mt="4">
              <VBtn
                color="warning"
                @click="
                  (textDialog.open = false),
                    importPlayers(textDialog.content, { merge: false })
                "
              >
                还原
              </VBtn>
              <VBtn
                color="primary"
                @click="
                  (textDialog.open = false),
                    importPlayers(textDialog.content, { merge: true })
                "
              >
                合并
              </VBtn>
            </div>
            <div v-else flex justify-center mt="4">
              <VBtn color="primary" @click="textDialog.open = false">确认</VBtn>
            </div>
          </VCardText>
        </OverlayScrollbarsComponent>
      </VCard>
    </VDialog>
  </VContainer>
</template>

<style scoped></style>
