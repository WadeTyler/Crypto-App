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
  ids?: string;
};

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  description: Description;
  categories: string[];
  links: Links;
  image: Image;
  market_data: MarketData;
  cachedAt: string; // ISO 8601 date string from LocalDateTime
}

export interface Description {
  en: string;
}

export interface Links {
  homepage: string[];
}

export interface Image {
  thumb: string;
  small: string;
  large: string;
}

export interface MarketData {
  current_price: CurrentPrice;
  market_cap: MarketCap;
  market_cap_rank: number;
  total_volume: TotalVolume;
  high_24h: High24h;
  low_24h: Low24h;
  ath: Ath;
  atl: Atl;
  price_change_24h_in_currency: PriceChange24hInCurrency;
  price_change_percentage_24h_in_currency: PriceChangePercentage24InCurrency;
  total_supply: number;
  max_supply: number;
  circulating_supply: number;
}

export interface CurrentPrice {
  usd: number;
  eur: number;
}

export interface MarketCap {
  usd: number;
  eur: number;
}

export interface TotalVolume {
  usd: number;
  eur: number;
}

export interface High24h {
  usd: number;
  eur: number;
}

export interface Low24h {
  usd: number;
  eur: number;
}

export interface PriceChange24hInCurrency {
  usd: number;
  eur: number;
}

export interface PriceChangePercentage24InCurrency {
  usd: number;
  eur: number;
}

export interface Ath {
  usd: number;
  eur: number;
}

export interface Atl {
  usd: number;
  eur: number;
}