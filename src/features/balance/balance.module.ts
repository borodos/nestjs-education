import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service.js';
import { USERS_REPOSITORY } from '../../common/repositories/users/users.repository.interface.js';
import { UsersRepository } from '../../common/repositories/users/users.repository.js';
import { BalanceController } from './balance.controller.js';

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
