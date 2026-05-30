import { UserService } from './user.service.js';
import { Test } from '@nestjs/testing';
import { USERS_REPOSITORY } from '../../common/repositories/users/users.repository.interface.js';
import { PaginateService } from '../../common/services/paginate.service.js';
import { NotFoundException } from '@nestjs/common';
import { jest } from '@jest/globals';

describe('UserService', () => {
  let service: UserService;

  const mockUsersRepository = {
    paginate: jest.fn(),
    findById: jest.fn(),
    softDelete: jest.fn(),
  };

  const mockPaginateService = {
    formatPaginate: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: USERS_REPOSITORY, useValue: mockUsersRepository },
        { provide: PaginateService, useValue: mockPaginateService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('findById', () => {
    it('Возвращает пользователя, если найден', async () => {
      const user = { id: 1, login: 'ivan' };
      mockUsersRepository.findById.mockResolvedValue(user as never);

      await expect(service.findById(1)).resolves.toBe(user);
    });

    it('Бросает NotFoundException, если не найден', async () => {
      mockUsersRepository.findById.mockResolvedValue(null as never);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('Правильно считает skip и строит where с поиском', async () => {
      mockUsersRepository.paginate.mockResolvedValue({ items: [], total: 0 });
      mockPaginateService.formatPaginate.mockReturnValue({
        data: [],
        meta: {},
      });

      await service.findAll({ page: 2, limit: 10, search: 'ivan' } as any);

      expect(mockUsersRepository.paginate).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
          where: expect.objectContaining({
            deleted_at: null,
            OR: [{ login: { contains: 'ivan', mode: 'insensitive' } }],
          }),
        }),
      );
    });
  });

  describe('remove', () => {
    it('Правильно производит обновление пользовтеля при удалении', async () => {
      const user = { id: 1, deleted_at: new Date() };
      mockUsersRepository.softDelete.mockResolvedValue(user as never);

      await expect(service.remove(1)).resolves.toBe(user);
    });
  });
});
