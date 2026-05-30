import { Module } from '@nestjs/common';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { USERS_REPOSITORY } from '../../common/repositories/users/users.repository.interface.js';
import { UsersRepository } from '../../common/repositories/users/users.repository.js';
import { PaginateService } from '../../common/services/paginate.service.js';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    PaginateService,
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
