import { CacheStore } from '@/data/protocols';
import { LocalSavePurchases } from '@/data/usecases';
import { SavePurchases } from '@/domain/usecases/save-purchases';

class CacheStoreSpy implements CacheStore {
  public insertKey: string;
  public deleteKey: string;
  public insertValues: SavePurchases.Params[] = [];
  public insertCallsCount: number = 0;
  public deleteCallsCount: number = 0;

  delete(key: string): void {
    this.deleteKey = key;
    this.deleteCallsCount++;
  }

  insert(key: string, value: any): void {
    this.insertKey = key;
    this.insertValues = value;
    this.insertCallsCount++;
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => {
      throw new Error();
    });
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => {
      throw new Error();
    });
  }
}

// @ts-ignore
const mockArrayPurchases = Array.from(Array(2), (_, i) => i + 1);
const mockPurchases = (): SavePurchases.Params[] => mockArrayPurchases.map(key => ({
  id: `${key + 1}`,
  date: new Date(),
  value: key * 20
}));

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
