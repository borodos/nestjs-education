import { RegisterQueueOptions } from '@nestjs/bullmq';

export const QUEUE_NAMES = {
  addAvatarToProfile: 'add_avatar_to_profile_queue',
  userBalance: 'user_balance_queue',
  scheduleQueue: 'schedule_queue',
} as const;

const queues: RegisterQueueOptions[] = [
  {
    name: QUEUE_NAMES.addAvatarToProfile,
  },
  {
    name: QUEUE_NAMES.userBalance,
  },
  {
    name: QUEUE_NAMES.scheduleQueue,
  },
];

export default [...queues];
