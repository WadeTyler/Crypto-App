export type Roi = {
  times: number;
  currency: string;
  percentage: number;
};

export type Coin = {
  id: string;
  symbol: string;
  name: string;
  image: string;

  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null; // can be null
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi?: Roi; // optional, since it can be null in APIs
  last_updated: string;
};

export type GetCoinsParams = {
  page?: number;
  per_page?: number;   // match API param naming
  vs_currency: string; // match API param naming
};