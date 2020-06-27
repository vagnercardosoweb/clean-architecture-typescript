export interface SavePurchases {
  save: (purchases: SavePurchases.Params[]) => Promise<void>
}

export namespace SavePurchases {
  export interface Params {
    id: string;
    date: Date;
    value: number
  }
}
