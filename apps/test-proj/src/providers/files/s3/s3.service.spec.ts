import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { S3Service } from './s3.service';
import { S3Lib } from './constants/do-spaces-service-lib.constant';

describe('S3Service', () => {
  let service: S3Service;

  const mockS3 = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3Service, { provide: S3Lib, useValue: mockS3 }],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
