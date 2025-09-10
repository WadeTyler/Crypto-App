
export type Holding = {
  cryptoId: string;
  quantity: number;
  createdAt: string;
  modifiedAt: string;
}

export type Portfolio = {
  id: number;
  name: string;
  holdings: Holding[];
  createdAt: string;
  updatedAt: string;
}