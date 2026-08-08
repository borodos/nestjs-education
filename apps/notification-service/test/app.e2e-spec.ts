import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { NotificationServiceModule } from './../src/notification-service.module';

describe('NotificationServiceController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [NotificationServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) — маршрутов нет, ожидаем 404', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });

  afterEach(async () => {
    await app.close();
  });
});
