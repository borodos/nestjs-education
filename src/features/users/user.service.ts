import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../../../generated/prisma/client.js';
import { QueryPaginateDto } from '../../common/dto/query-paginate.dto.js';
import { UserWhereInput } from '../../../generated/prisma/models/User.js';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from '../../common/repositories/users/users.repository.interface.js';
import { PaginateService } from '../../common/services/paginate.service.js';

@Injectable()
export class UserService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
    private readonly paginateService: PaginateService,
  ) {}

  async findAll(params: QueryPaginateDto) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    let where: UserWhereInput = {
      deleted_at: null,
    };

    if (search) {
      where = {
        ...where,
        OR: [{ login: { contains: search, mode: 'insensitive' } }],
      };
    }

    const { items, total } = await this.usersRepository.paginate({
      where,
      skip,
      take: limit,
      orderBy: { id: 'desc' },
      select: {
        id: true,
        login: true,
        profile: true,
        created_at: true,
        updated_at: true,
      },
    });

    return this.paginateService.formatPaginate(params, items, total);
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) throw new NotFoundException('Пользователь не найден!');

    return user;
  }

  async remove(id: number, authUser: Express.User | undefined): Promise<User> {
    if (authUser?.id !== id) {
      throw new BadRequestException('Можно удалить только свой аккаунт!');
    }

    return this.usersRepository.softDelete(id);
  }
}
