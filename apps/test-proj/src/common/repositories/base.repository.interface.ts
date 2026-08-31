export interface IBaseRepository<T, CreateDto, UpdateDto> {
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(dto: CreateDto): Promise<T>;
  update(id: number, dto: UpdateDto): Promise<T>;
  delete(id: number): Promise<T>;
}
