import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from '../../common/repositories/users/users.repository.interface.js';
import { TransferBodyDto } from './dto/transfer-body.dto.js';
import { Decimal } from '../../../generated/prisma/internal/prismaNamespace.js';
import { PrismaService } from '../../providers/databases/prisma/prisma.service.js';
import { CustomLoggerService } from '../../providers/logger/logger.service.js';
import { UserBalanceQueueProducer } from '../../providers/queues/producers/user-balance-queue.producer.js';

@Injectable()
export class BalanceService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly logger: CustomLoggerService,
    private readonly prismaService: PrismaService,
    private readonly userBalanceQueueProducer: UserBalanceQueueProducer,
  ) {
    logger.setContext(BalanceService.name);
  }

  async transfer(
    authUser: Express.User,
    data: TransferBodyDto,
  ): Promise<string> {
    const toUser = await this.usersRepository.findById(data.toUserId);
    const currentUser = await this.usersRepository.findById(authUser.id);

    if (!toUser) {
      this.logger.error(`Пользователь не найден: ${data.toUserId}`);
      throw new NotFoundException('Пользователь не найден!');
    }

    if (!currentUser) {
      this.logger.error(`Текущий пользователь не найден: ${authUser.id}`);
      throw new NotFoundException('Текущий пользователь не найден!');
    }

    const currentUserBalance = new Decimal(currentUser.balance);
    if (currentUserBalance.toNumber() === 0) {
      this.logger.error(`Баланс инициирующего пользователя равен нулю!`);
      throw new HttpException('Нулевой баланс!', 500);
    }

    const amount = new Decimal(data.amount);
    const currentUserBalanceResult = currentUserBalance.minus(amount);

    if (currentUserBalanceResult.toNumber() < 0) {
      this.logger.error(
        `Баланс инициирующего пользователя не может быть отрицательным!`,
      );
      throw new HttpException('Не хватает денег!', 500);
    }

    const toUserBalance = new Decimal(toUser.balance);
    const toUserBalanceResult = toUserBalance.add(amount);

    await this.prismaService.$transaction([
      this.prismaService.user.update({
        where: { id: currentUser.id },
        data: { balance: currentUserBalanceResult.toNumber() },
      }),
      this.prismaService.user.update({
        where: { id: toUser.id },
        data: { balance: toUserBalanceResult.toNumber() },
      }),
    ]);

    return 'Перевод успешно завершен!';
  }

  async nullifyBalances(): Promise<string> {
    await this.userBalanceQueueProducer.nullifyBalances();
    return 'Все балансы обнулены!';
  }
}
