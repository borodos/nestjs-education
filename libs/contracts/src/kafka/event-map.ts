import { KafkaTopic } from './topics';
import { BalanceUpdatedEvent } from '@app/contracts/kafka/events/balance-updated.event';

export interface KafkaEventMap {
  [KafkaTopic.BALANCE_UPDATED]: BalanceUpdatedEvent;
}

export type KafkaEventPayload<T extends keyof KafkaEventMap> = KafkaEventMap[T];
