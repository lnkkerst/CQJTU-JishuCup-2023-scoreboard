import { Base64 } from 'js-base64';
import { gzip, ungzip } from 'pako';
import type { Player } from '~/types';

export function exportJson(players: Player[]): string {
  return Base64.fromUint8Array(gzip(JSON.stringify(players)));
}

export function importJson(raw: string): Player[] {
  return JSON.parse(ungzip(Base64.toUint8Array(raw), { to: 'string' }));
}
