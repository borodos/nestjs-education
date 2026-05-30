import { Injectable } from '@nestjs/common';
import { QueryPaginateDto } from '../dto/query-paginate.dto.js';

@Injectable()
export class PaginateService {
  formatPaginate(params: QueryPaginateDto, items: object[], total: number) {
    const { page, limit } = params;
    const totalPages = Math.ceil(total / limit);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }
}
