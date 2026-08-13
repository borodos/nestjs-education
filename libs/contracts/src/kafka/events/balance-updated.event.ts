export interface BalanceUpdatedEvent {
  currentUserId: number;
  toUserId: number;
  amount: number;
  date: string;
}
