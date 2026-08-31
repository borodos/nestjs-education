import { IBaseRepository } from '../base.repository.interface';
import { Notification } from '../../../../../../mongodb/schemas/notifications.schema';
import { CreateNotificationDto } from '../../../features/notification/dto/create-notification.dto';

export interface INotificationRepository extends IBaseRepository<
  Notification,
  CreateNotificationDto
> {
  create(data: CreateNotificationDto): Promise<Notification>;
}
export const NOTIFICATION_REPOSITORY = Symbol('NOTIFICATION_REPOSITORY');
