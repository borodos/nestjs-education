import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    remove: jest.fn(),
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
    service = module.get<UserService>(UserService);
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

      const result = await controller.findAll(params as any);

      expect(service.findAll).toHaveBeenCalledWith(params);
      expect(result).toBe(expected);
    });
  });

  describe('findById', () => {
    it('Вызывает service.findById с id и возвращает пользователя', async () => {
      const user = { id: 1, login: 'ivan' };
      mockUserService.findById.mockResolvedValue(user);

      const result = await controller.findById(1);

      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(user);
    });
  });

  describe('remove', () => {
    it('Вызывает service.remove с числовым id', async () => {
      const user = { id: 1, deleted_at: new Date() };
      mockUserService.remove.mockResolvedValue(user);

      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBe(user);
    });
  });
});
