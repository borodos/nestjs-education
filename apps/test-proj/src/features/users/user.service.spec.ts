import { UserService } from './user.service';
import { Test } from '@nestjs/testing';
import {
  type IUsersRepository,
  USERS_REPOSITORY,
} from '../../common/repositories/users/users.repository.interface';
import { PaginateService } from '../../common/services/paginate.service';
import { NotFoundException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { User } from '../../../../../generated/prisma/client';
import { CacheService } from '../../providers/cache/cache.service';
import { LoggerService } from '@app/logger';

describe('UserService', () => {
  let service: UserService;

  const mockUsersRepository = {
    paginate: jest.fn<IUsersRepository['paginate']>(),
    findById: jest.fn<IUsersRepository['findById']>(),
    softDelete: jest.fn<IUsersRepository['softDelete']>(),
  };

  const mockPaginateService = {
    formatPaginate: jest.fn<PaginateService['formatPaginate']>(),
  };

  const mockCacheService = {
    get: jest.fn<CacheService['get']>(),
    set: jest.fn<CacheService['set']>(),
    delete: jest.fn<CacheService['delete']>(),
  };

  const mockLogger = {
    setContext: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: USERS_REPOSITORY, useValue: mockUsersRepository },
        { provide: PaginateService, useValue: mockPaginateService },
        { provide: CacheService, useValue: mockCacheService },
        { provide: LoggerService, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findById', () => {
    it('Возвращает пользователя, если найден', async () => {
      const user = { id: 1, login: 'ivan' } as User;
      mockUsersRepository.findById.mockResolvedValue(user);

      await expect(service.findById(1)).resolves.toBe(user);
    });

    it('Бросает NotFoundException, если не найден', async () => {
      mockUsersRepository.findById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('Правильно считает skip и строит where с поиском', async () => {
      mockUsersRepository.paginate.mockResolvedValue({ items: [], total: 0 });
      mockPaginateService.formatPaginate.mockReturnValue({
        data: [],
        meta: {
          total: 0,
          page: 2,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: true,
        },
      });

      await service.findAll({ page: 2, limit: 10, search: 'ivan' });

      expect(mockUsersRepository.paginate).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
          where: {
            deleted_at: null,
            OR: [{ login: { contains: 'ivan', mode: 'insensitive' } }],
          },
        }),
      );
    });
  });

  describe('remove', () => {
    it('Правильно производит обновление пользовтеля при удалении', async () => {
      const user = { id: 1, deleted_at: new Date() } as User;
      mockUsersRepository.softDelete.mockResolvedValue(user);

      const authUser = { id: 1, login: 'ivan' };

      await expect(service.remove(1, authUser)).resolves.toBe(user);
    });
  });
});
