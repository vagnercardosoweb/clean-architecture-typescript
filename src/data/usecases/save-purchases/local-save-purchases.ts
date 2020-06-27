import { CacheStore } from '@/data/protocols';

export class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {
  }

  async save(): Promise<void> {
    this.cacheStore.delete('purchases');
  }
}
