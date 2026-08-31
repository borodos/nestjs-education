import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import 'dotenv/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notifications-service',
        brokers: [process.env['KAFKA_BROKER_URL'] ?? 'localhost:9092'],
      },
      consumer: {
        groupId: 'notifications-consumer',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env['NOTIFICATION_SERVICE_PORT'] ?? 3001);
}
void bootstrap();
