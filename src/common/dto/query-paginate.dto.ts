import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryPaginateDto {
  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Номер страницы',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 10,
    default: 5,
    maximum: 100,
    description: 'Кол-во записей на страницу',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 5;

  @ApiPropertyOptional({ example: 'ivan', description: 'Поиск по логину' })
  @IsOptional()
  @IsString()
  search?: string;
}
