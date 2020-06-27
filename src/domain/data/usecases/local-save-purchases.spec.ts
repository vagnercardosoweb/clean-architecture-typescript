interface CacheStore {
  delete: () => void;
}

class CacheStoreSpy implements CacheStore {
  public deleteCallsCount: number = 0;

  delete(): void {
    this.deleteCallsCount++;
  }
}

class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {
  }

  async save(): Promise<void> {
    this.cacheStore.delete();
  }
}

describe('LocalSavePurchases', () => {
  test('should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy();
    const savePurchases = new LocalSavePurchases(cacheStore);

    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  test('should delete old cache on sut.save', async () => {
    const cacheStore = new CacheStoreSpy();
    const savePurchases = new LocalSavePurchases(cacheStore);

    await savePurchases.save();

    expect(cacheStore.deleteCallsCount).toBe(1);
  });
});
