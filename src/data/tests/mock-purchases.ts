import faker from 'faker';

import { SavePurchases } from '@/domain/usecases/save-purchases';

export const mockPurchases = (): SavePurchases.Params[] =>
  Array.from(Array(2)).map(() => ({
    id: faker.random.uuid(),
    date: faker.date.recent(),
    value: faker.random.number()
  }));
