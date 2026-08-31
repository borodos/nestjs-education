export interface IBaseRepository<T, CreateDto> {
  create(dto: CreateDto): Promise<T>;
}
