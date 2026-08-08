import { IBaseRepository } from '../base.repository.interface';
import { User } from '../../../../../../generated/prisma/client';
import { CreateUserDto } from '../../../features/users/dto/create-user.dto';
import { UpdateUserDto } from '../../../features/users/dto/update-user.dto';
import {
  UserGetPayload,
  UserOrderByWithRelationInput,
  UserSelect,
  UserWhereInput,
} from '../../../../../../generated/prisma/models/User';

export type UsersPaginate = {
  where: UserWhereInput;
  skip: number;
  take: number;
  orderBy: UserOrderByWithRelationInput;
  select: UserSelect;
};

type UserWithProfile = UserGetPayload<{
  include: { profile: true };
}>;

export type ResultUsersPaginate = {
  items: UserWithProfile[];
  total: number;
};

export type ActiveUserRaw = UserGetPayload<{
  include: { profile: { include: { avatars: true } } };
}>;

export type UsersForBalanceOperation = {
  toUser: User;
  currentUser: User;
};

export interface IUsersRepository extends IBaseRepository<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  findByLogin(login: string): Promise<User | null>;
  paginate(params: UsersPaginate): Promise<ResultUsersPaginate>;
  softDelete(id: number): Promise<User>;
  getActive(minAge: number, maxAge: number): Promise<ActiveUserRaw[]>;
  findUsersForBalanceOperation(
    toUserId: number,
    currentUserId: number,
  ): Promise<UsersForBalanceOperation>;
  transferFunds(
    currentUserId: number,
    currentUserBalance: number,
    toUserId: number,
    toUserBalance: number,
  ): Promise<User[]>;
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
