import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {
  @Prop()
  currentUserId: number;

  @Prop()
  toUserId: number;

  @Prop()
  amount: number;

  @Prop()
  date: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
