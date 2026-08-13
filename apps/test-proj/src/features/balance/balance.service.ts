import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from '../../common/repositories/users/users.repository.interface';
import { TransferBodyDto } from './dto/transfer-body.dto';
import { Decimal } from '../../../../../generated/prisma/internal/prismaNamespace';
import { UserBalanceQueueProducer } from '../../providers/queues/producers/user-balance-queue.producer';
import { LoggerService } from '@app/logger';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaTopic } from '@app/contracts';

@Injectable()
export class BalanceService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly logger: LoggerService,
    private readonly userBalanceQueueProducer: UserBalanceQueueProducer,

    @Inject('NOTIFICATIONS_CLIENT')
    private readonly kafkaProducer: ClientKafka,
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

    await this.usersRepository.transferFunds(
      currentUser.id,
      currentUserBalanceResult.toNumber(),
      toUser.id,
      toUserBalanceResult.toNumber(),
    );

    this.kafkaProducer.emit(KafkaTopic.BALANCE_UPDATED, {
      currentUserId: currentUser.id,
      toUserId: toUser.id,
      amount: data.amount,
      date: new Date().toISOString(),
    });
    return 'Перевод успешно завершен!';
  }

  async nullifyBalances(): Promise<string> {
    await this.userBalanceQueueProducer.nullifyBalances();
    return 'Все балансы обнулены!';
  }
}
