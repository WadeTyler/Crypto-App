import type {Coin, GetCoinsParams} from "./coin.types.ts";

const API_URL = import.meta.env.VITE_BASE_API_URL;

export async function getCoins(getCoinsParams: GetCoinsParams): Promise<Coin[]> {
  const {page = 1, per_page = 10, vs_currency} = getCoinsParams;

  const response = await fetch(`${API_URL}/api/v1/coins?vs_currency=${vs_currency}&per_page=${per_page}&page=${page}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch coins');
  }

  return data;
}