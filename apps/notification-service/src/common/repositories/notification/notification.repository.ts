import { Injectable } from '@nestjs/common';
import { INotificationRepository } from './notification.repository.interface';
import { CreateNotificationDto } from 'apps/notification-service/src/features/notification/dto/create-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../../../../../../mongodb/schemas/notifications.schema';

@Injectable()
export class NotificationRepository implements INotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  create(data: CreateNotificationDto): Promise<Notification> {
    const createdModel = new this.notificationModel(data);
    return createdModel.save();
  }
}
