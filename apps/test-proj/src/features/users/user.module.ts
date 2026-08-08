import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { USERS_REPOSITORY } from '../../common/repositories/users/users.repository.interface';
import { UsersRepository } from '../../common/repositories/users/users.repository';
import { PaginateService } from '../../common/services/paginate.service';

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
