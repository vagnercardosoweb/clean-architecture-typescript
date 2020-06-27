import { LocalSavePurchases } from '@/data/usecases';
import { mockPurchases } from '@/data/tests/mock-purchases';
import { CacheStoreSpy } from '@/data/tests/mock-cache';

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

    await savePurchases.save(mockPurchases());

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deleteKey).toBe('purchases');
  });

  test('should not insert new Cache if delete fails', () => {
    const { cacheStore, savePurchases } = makeSavePurchases();

    cacheStore.simulateDeleteError();

    expect(cacheStore.insertCallsCount).toBe(0);
    expect(savePurchases.save(mockPurchases())).rejects.toThrow();
  });

  test('should insert new Cache if delete succeeds', async () => {
    const { cacheStore, savePurchases } = makeSavePurchases();

    const purchases = mockPurchases();
    await savePurchases.save(purchases);

    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe('purchases');
    expect(cacheStore.insertValues).toEqual(purchases);
  });

  test('should throw if insert throws', () => {
    const { cacheStore, savePurchases } = makeSavePurchases();

    cacheStore.simulateInsertError();

    expect(savePurchases.save(mockPurchases())).rejects.toThrow();
  });
});
