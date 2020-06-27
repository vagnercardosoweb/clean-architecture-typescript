import { CacheStore } from '@/data/protocols';
import { SavePurchases } from '@/domain/usecases/save-purchases';

export class LocalSavePurchases implements SavePurchases {
  constructor(private readonly cacheStore: CacheStore) {
  }

  async save(purchases: SavePurchases.Params[]): Promise<void> {
    this.cacheStore.delete('purchases');
    this.cacheStore.insert('purchases', purchases);
  }

}
