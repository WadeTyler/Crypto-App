
export type CreateTransactionRequest = {
  cryptoId: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  fee: number;
}