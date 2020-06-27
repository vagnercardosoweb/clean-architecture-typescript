interface CacheStore {
}

class CacheStoreSpy implements CacheStore {
  public deleteCallsCount: number = 0;
}

class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {
  }
}

describe('LocalSavePurchases', () => {
  test('should not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy();
    const savePurchases = new LocalSavePurchases(cacheStore);

    expect(cacheStore.deleteCallsCount).toBe(0);
  });
});
