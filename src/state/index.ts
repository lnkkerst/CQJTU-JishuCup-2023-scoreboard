import { useLocalStorage } from '@vueuse/core';
import type { Player } from '~/types';

export function usePlayerState() {
  return useLocalStorage<Player[]>('jsb-players', [], { mergeDefaults: true });
}
