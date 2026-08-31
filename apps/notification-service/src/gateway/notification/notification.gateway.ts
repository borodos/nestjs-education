import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { LoggerService } from '@app/logger';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

type JwtPayload = { sub: number; login: string };

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly NOTIF_ROOM_NAME: string = 'notif-room';

  constructor(
    private readonly logger: LoggerService,
    private readonly jwtService: JwtService,
  ) {
    logger.setContext(NotificationGateway.name);
  }

  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`ID клиента: ${client.id} подключен`);
    this.logger.log(`Кол-во подключений: ${this.io.sockets.sockets.size}`);
    let userId: number;

    try {
      const authHeader = client.handshake.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('Неавторизованное действие!');
      }

      const jwtPayload: JwtPayload = this.jwtService.verify(authHeader);
      userId = jwtPayload.sub;
    } catch (error: any) {
      client.disconnect();
      this.logger.error(error);
      return;
    }

    const room = `${this.NOTIF_ROOM_NAME}:${userId}`;
    await client.join(room);
    this.logger.log(`Клиент ${client.id} вошел в комнату ${room}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`ID клиента: ${client.id} отключен`);
  }

  @SubscribeMessage('ping')
  handleMessage(client: Socket, data: any) {
    this.logger.log(`Получено сообщение от клиента: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    return {
      event: 'pong',
      data: null,
    };
  }

  sendNotification(userId: number, message: string) {
    this.io
      .to(`${this.NOTIF_ROOM_NAME}:${userId}`)
      .emit('notification', message);

    this.logger.log('Уведомление отправлено пользователю');
  }
}
