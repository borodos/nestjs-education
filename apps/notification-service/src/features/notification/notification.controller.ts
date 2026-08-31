import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationGateway } from '../../gateway/notification/notification.gateway';
import { type KafkaEventPayload, KafkaTopic } from '@app/contracts';
import {
  type INotificationRepository,
  NOTIFICATION_REPOSITORY,
} from '../../common/repositories/notification/notification.repository.interface';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationGateway: NotificationGateway,

    @Inject(NOTIFICATION_REPOSITORY)
    private notificationRepository: INotificationRepository,
  ) {}

  @EventPattern(KafkaTopic.BALANCE_UPDATED)
  async onBalanceUpdated(
    @Payload() event: KafkaEventPayload<typeof KafkaTopic.BALANCE_UPDATED>,
  ) {
    const messageToCurrentUser = `С вашего баланса было произведено
     списание в размере ${event.amount} рублей. Дата операции: ${event.date}`;
    const messageToUser = `На ваш баланс было зачислено ${event.amount} рублей. 
    Дата операции: ${event.date}`;

    this.notificationGateway.sendNotification(
      event.currentUserId,
      messageToCurrentUser,
    );
    this.notificationGateway.sendNotification(event.toUserId, messageToUser);

    await this.notificationRepository.create(event);
  }
}
