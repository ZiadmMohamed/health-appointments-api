import {
  DeepPartial,
  FindManyOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
export abstract class BaseDBRepo<T> {
  constructor(protected readonly entityRepo: Repository<T>) {}
  async create(data: DeepPartial<T>): Promise<T> {
    return await this.entityRepo.save(data);
  }

  async findOneById(id: unknown): Promise<T | null> {
    return await this.entityRepo.findOneBy({ id } as FindOptionsWhere<T>);
  }
  async findAll(options: FindManyOptions<T>): Promise<T[]> {
    return await this.entityRepo.find(options);
  }
  async remove(data: T): Promise<T> {
    return await this.entityRepo.remove(data);
  }
}
