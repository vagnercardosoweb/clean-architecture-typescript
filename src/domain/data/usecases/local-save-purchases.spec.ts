interface CacheStore {
  delete: (key: string) => void;
}

class CacheStoreSpy implements CacheStore {
  public key: string;
  public deleteCallsCount: number = 0;

  delete(key: string): void {
    this.key = key;
    this.deleteCallsCount++;
  }
}

class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {
  }

  async save(): Promise<void> {
    this.cacheStore.delete('purchases');
  }
}

type SavePurchasesTypes = {
  cacheStore: CacheStoreSpy;
  savePurchases: LocalSavePurchases;
}

const makeSavePurchases = (): SavePurchasesTypes => {
  const cacheStore = new CacheStoreSpy();
  const savePurchases = new LocalSavePurchases(cacheStore);

  return { cacheStore, savePurchases };
};

describe('LocalSavePurchases', () => {
  test('should not delete cache on sut.init', () => {
    const { cacheStore } = makeSavePurchases();

    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  test('should delete old cache on sut.save', async () => {
    const { cacheStore, savePurchases } = makeSavePurchases();

    await savePurchases.save();

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.key).toBe('purchases');
  });
});
