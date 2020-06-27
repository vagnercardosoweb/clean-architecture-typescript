import { CacheStore } from '@/data/protocols';
import { SavePurchases } from '@/domain/usecases/save-purchases';

export class CacheStoreSpy implements CacheStore {
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
