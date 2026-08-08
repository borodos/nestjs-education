import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { USERS_REPOSITORY } from '../../common/repositories/users/users.repository.interface';
import { UsersRepository } from '../../common/repositories/users/users.repository';
import { BalanceController } from './balance.controller';

@Module({
  providers: [
    BalanceService,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
  ],
  controllers: [BalanceController],
})
export class BalanceModule {}
