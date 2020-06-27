import { CacheStore } from '@/data/protocols';
import { LocalSavePurchases } from '@/data/usecases';

class CacheStoreSpy implements CacheStore {
  public insertKey: string;
  public deleteKey: string;
  public insertCallsCount: number = 0;
  public deleteCallsCount: number = 0;

  delete(key: string): void {
    this.deleteKey = key;
    this.deleteCallsCount++;
  }

  insert(key: string): void {
    this.insertKey = key;
    this.insertCallsCount++;
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
    expect(cacheStore.deleteKey).toBe('purchases');
  });

  test('should not insert new Cache if delete fails', () => {
    const { cacheStore, savePurchases } = makeSavePurchases();

    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(cacheStore.insertCallsCount).toBe(0);
    expect(savePurchases.save()).rejects.toThrow();
  });

  test('should insert new Cache iof delete succeeds', async () => {
    const { cacheStore, savePurchases } = makeSavePurchases();

    await savePurchases.save();

    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe('purchases');
  });
});
