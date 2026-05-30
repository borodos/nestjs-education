import { ApiProperty } from '@nestjs/swagger';

class ProfileUser {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  user_id: number;

  @ApiProperty({ example: 12 })
  age: number;

  @ApiProperty({ example: 'test test' })
  description: string;

  @ApiProperty({ example: '2026-05-29T17:24:56.436Z' })
  created_at: string;

  @ApiProperty({ example: '2026-05-29T17:24:56.436Z' })
  updated_at: string;

  @ApiProperty({ example: '2026-05-29T17:24:56.436Z' })
  deleted_at: string;
}

class PaginationUser {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 'login_test' })
  login: string;

  @ApiProperty({ type: ProfileUser })
  profile: ProfileUser[];

  @ApiProperty({ example: '2026-05-29T17:24:56.436Z' })
  created_at: string;

  @ApiProperty({ example: '2026-05-29T17:24:56.436Z' })
  updated_at: string;
}

class PaginationMeta {
  @ApiProperty({ example: 4 })
  total: number;

  @ApiProperty({ example: 2 })
  page: number;

  @ApiProperty({ example: 5 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;
}

export class ResponsePaginationUsersDto {
  @ApiProperty({ type: [PaginationUser] })
  data: PaginationUser[];

  @ApiProperty({ type: PaginationMeta })
  meta: PaginationMeta;
}
