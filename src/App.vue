<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VList,
  VListItem,
  VMain,
  VNavigationDrawer
} from 'vuetify/components';

const drawer = ref(false);
const route = useRoute();
</script>

<template>
  <VApp>
    <VAppBar color="primary">
      <VAppBarNavIcon
        variant="text"
        @click.stop="drawer = !drawer"
      ></VAppBarNavIcon>
    </VAppBar>

    <VNavigationDrawer v-model="drawer">
      <VList>
        <VListItem
          color="primary"
          value="index"
          :active="route.name === 'index'"
        >
          首页
        </VListItem>
      </VList>
    </VNavigationDrawer>

    <VMain>
      <RouterView></RouterView>
    </VMain>
  </VApp>
</template>

<style scoped></style>
