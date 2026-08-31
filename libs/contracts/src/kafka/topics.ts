export const KafkaTopic = {
  BALANCE_UPDATED: 'balance.updated',
} as const;

export type KafkaTopic = (typeof KafkaTopic)[keyof typeof KafkaTopic];
