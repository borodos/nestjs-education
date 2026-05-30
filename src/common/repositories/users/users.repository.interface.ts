import { IBaseRepository } from '../base.repository.interface.js';
import { User } from '../../../../generated/prisma/client.js';
import { CreateUserDto } from '../../../features/users/dto/create-user.dto.js';
import { UpdateUserDto } from '../../../features/users/dto/update-user.dto.js';
import {
  UserGetPayload,
  UserOrderByWithRelationInput,
  UserSelect,
  UserWhereInput,
} from '../../../../generated/prisma/models/User.js';

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

export interface IUsersRepository extends IBaseRepository<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  findByLogin(login: string): Promise<User | null>;
  paginate(params: UsersPaginate): Promise<ResultUsersPaginate>;
  softDelete(id: number): Promise<User>;
}

export const USERS_REPOSITORY = Symbol('USERS_REPOSITORY');
