import {
  Inject,
  Injectable,
  UnprocessableEntityException,
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

  async transfer(authUser: Express.User, data: TransferBodyDto) {
    const { toUser, currentUser } =
      await this.usersRepository.findUsersForBalanceOperation(
        data.toUserId,
        authUser.id,
      );

    const currentUserBalance = new Decimal(currentUser.balance);
    if (currentUserBalance.toNumber() === 0) {
      this.logger.error(`Баланс инициирующего пользователя равен нулю!`);
      throw new UnprocessableEntityException('Нулевой баланс!');
    }

    const amount = new Decimal(data.amount);
    const currentUserBalanceResult = currentUserBalance.minus(amount);

    if (currentUserBalanceResult.toNumber() < 0) {
      this.logger.error(
        `Баланс инициирующего пользователя не может быть отрицательным!`,
      );
      throw new UnprocessableEntityException('Не хватает денег!');
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
