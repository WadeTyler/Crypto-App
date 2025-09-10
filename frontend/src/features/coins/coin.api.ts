import type {Coin, CoinData, GetCoinsParams} from "./coin.types.ts";

const API_URL = import.meta.env.VITE_BASE_API_URL;

export async function getCoins(getCoinsParams: GetCoinsParams): Promise<Coin[]> {
  const {page = 1, per_page = 10, vs_currency, ids = ""} = getCoinsParams;

  const url = `${API_URL}/api/v1/coins?vs_currency=${vs_currency}&per_page=${per_page}&page=${page}${ids ? `&ids=${ids}` : ''}`;
  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch coins');
  }

  return data;
}

export async function getCoinDataById(id: string | undefined): Promise<CoinData> {
  if (!id) {
    throw new Error('Coin ID is required');
  }
  const response = await fetch(`${API_URL}/api/v1/coins/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch coin data');
  }
  return data;
}