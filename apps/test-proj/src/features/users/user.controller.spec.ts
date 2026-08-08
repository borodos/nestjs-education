import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import type { Request } from 'express';
import { User } from '../../../../../generated/prisma/client';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    findAll: jest.fn<UserService['findAll']>(),
    findById: jest.fn<UserService['findById']>(),
    remove: jest.fn<UserService['remove']>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('Вызывает service.findAll с параметрами и возвращает результат', async () => {
      const params = { page: 1, limit: 5, search: 'ivan' };
      const expected = {
        data: [{ id: 1, login: 'ivan' }],
        meta: {
          total: 1,
          page: 1,
          limit: 5,
          totalPages: 1,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      };
      mockUserService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll(params);

      expect(mockUserService.findAll).toHaveBeenCalledWith(params);
      expect(result).toBe(expected);
    });
  });

  describe('findById', () => {
    it('Вызывает service.findById с id и возвращает пользователя', async () => {
      const user = { id: 1, login: 'ivan' };
      mockUserService.findById.mockResolvedValue(user);

      const result = await controller.findById(1);

      expect(mockUserService.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(user);
    });
  });

  describe('remove', () => {
    it('Вызывает service.remove с числовым id', async () => {
      const user = { id: 1, deleted_at: new Date() } as User;
      mockUserService.remove.mockResolvedValue(user);

      const req = { user: { id: 1, login: 'ivan' } } as Request;

      const result = await controller.remove(1, req);

      expect(mockUserService.remove).toHaveBeenCalledWith(1, req.user);
      expect(result).toBe(user);
    });
  });
});
