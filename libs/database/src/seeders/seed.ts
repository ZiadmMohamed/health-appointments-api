import { DataSource, EntityManager } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '@app/user';
import { usersData } from './factories/user/data';

export default class DataBaseSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const entityManager = dataSource.createEntityManager();

    await seedDataIfNotExist(entityManager, User, usersData, (item) => ({
      email: item.email,
    }));
  }
}

async function seedDataIfNotExist<T>(
  entityManager: EntityManager,
  entity: { new (): T },
  data: Partial<T>[],
  condition: (item: Partial<T>) => any,
): Promise<void> {
  for (const item of data) {
    const isExist = await entityManager.findOne(entity, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: condition(item),
    });

    if (!isExist) {
      await entityManager.save(entity, item);
    }
  }
}
