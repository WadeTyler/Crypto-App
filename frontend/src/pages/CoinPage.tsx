import {Link, useParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {getCoinDataById} from "../features/coins/coin.api.ts";
import {LoadingMd} from "../components/LoadingSpinner.tsx";
import {useState} from "react";
import type {CoinData} from "../features/coins/coin.types.ts";
import {faArrowTrendDown, faArrowTrendUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import PriceChart from "../components/PriceChart.tsx";

export default function CoinPage() {

  const {id} = useParams();

  const {data: coinData, isLoading: loadingCoinData, error: coinDataError} = useQuery({
    queryKey: ['coin', id],
    queryFn: async () => await getCoinDataById(id)
  });

  return (
    <div className="page bg-gradient-to-tr from-background to-background-secondary/60">
      <div className="container mx-auto flex flex-col gap-8 bg-background rounded-md p-4 shadow-lg shadow-accent/10">
        {loadingCoinData && <LoadingMd/>}
        {coinDataError && <p className="text-danger text-center text-balance">{(coinDataError as Error).message}</p>}
        {coinData && !coinDataError && !loadingCoinData && (
          <div className="flex flex-col gap-4">

            {/* Coin Data Header */}
            <CoinDataHeader coinData={coinData}/>

            <hr/>

            { /* Market Data */}
            <MarketData coinData={coinData}/>
          </div>
        )}
      </div>
    </div>
  )
}

function MarketData({coinData}: { coinData: CoinData }) {
  const [vs_currency] = useState(localStorage.getItem("vs_currency") || "usd");

  function getCurrencySymbol(currency: string) {
    if (currency.toLowerCase() === "eur") return "€";
    return "$";
  }

  function CoinPercentageChange() {
    const priceChangePercentage = coinData.market_data?.price_change_percentage_24h_in_currency[vs_currency as 'usd' | 'eur'];
    const isPositive = priceChangePercentage >= 0;

    return (
      <div className="p-4 bg-secondary/10 rounded-md shadow-md shadow-accent/10">
        <h3 className="text-sm text-secondary/70">24hr Price Change</h3>
        <p className="text-2xl font-medium">
         <span
           className={`flex gap-2 items-center text-shadow-2xs ${isPositive ? 'text-green-400 text-shadow-green-400' : 'text-danger text-shadow-danger'}`}
         >
      {isPositive ? <FontAwesomeIcon icon={faArrowTrendUp}/> : <FontAwesomeIcon icon={faArrowTrendDown}/>}
           {priceChangePercentage}%
      </span>
        </p>
        <p className="text-sm text-secondary/70">
          {getCurrencySymbol(vs_currency)}
          {coinData.market_data.price_change_24h_in_currency[vs_currency as 'usd' | 'eur'].toLocaleString()}
        </p>
      </div>
    );
  }

  function CurrentPrice() {
    return (
      <div className="p-4 bg-secondary/10 rounded-md shadow-md shadow-accent/10">
        <h3 className="text-sm text-secondary/70">Current Price</h3>
        <p className="text-2xl font-medium">
          {getCurrencySymbol(vs_currency)}
          {coinData.market_data.current_price[vs_currency as 'usd' | 'eur'].toLocaleString()}
        </p>
        <div className="flex gap-4 justify-between items-center">
          <p className="text-xs text-secondary/70">
            ATH: {getCurrencySymbol(vs_currency)}
            {coinData.market_data.ath[vs_currency as 'usd' | 'eur'].toLocaleString()}
          </p>
          <p className="text-xs text-secondary/70">
            ATL: {getCurrencySymbol(vs_currency)}
            {coinData.market_data.atl[vs_currency as 'usd' | 'eur'].toLocaleString()}
          </p>
        </div>
      </div>
    )
  }

  function MarketCap() {
    return (
      <div className="p-4 bg-secondary/10 rounded-md shadow-md shadow-accent/10">
        <h3 className="text-sm text-secondary/70">Market Cap</h3>
        <p className="text-xl font-medium">
          {getCurrencySymbol(vs_currency)}
          {coinData.market_data.market_cap[vs_currency as 'usd' | 'eur'].toLocaleString()}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PriceChart coinId={coinData.id} coinName={coinData.name} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CurrentPrice/>
        <MarketCap/>
        <CoinPercentageChange/>
      </div>
    </div>
  )
}


function CoinDataHeader({coinData}: { coinData: CoinData }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-start gap-4">
        <img src={coinData.image.large} alt={coinData.name} className="w-16 h-16"/>
        <div className="flex flex-col">
          <h1 className="lg:text-5xl text-4xl font-bold text-accent flex items-center gap-2">
            {coinData.name}
          </h1>
          <div className="flex mt-1 items-center gap-2">
            <span className="text-xs text-foreground/70 bg-secondary/20 rounded-full shadow-md px-2 py-1">
              #{coinData.market_data.market_cap_rank}
            </span>
            <span className="text-sm text-secondary/70 text-shadow-none font-medium">
              ({coinData.symbol.toUpperCase()})
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div className="gap-2 items-center flex-wrap hidden md:flex">
          {coinData.categories
            .slice(0, 5) // limit to first 5 categories
            .map(category => (
              <span key={category} className="px-3 py-2 bg-secondary/30 text-xs font-medium rounded-md shadow-md">
                    {category}
                  </span>
            ))}
        </div>

        <Link className="btn-1 text-xs" to={coinData.links.homepage[0]} target="_blank" rel="noopener noreferrer">
          Visit Website
        </Link>
      </div>


      <CoinDataDescription description={coinData.description.en}/>

    </div>
  )
}

function CoinDataDescription({description}: { description: string }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (description.length <= 200) {
    return <p className="text-sm text-secondary/90">{description}</p>;
  }

  return (
    <div>
      <p className="text-sm text-secondary/90 flex flex-col items-start">
        {isExpanded ? description : description.substring(0, 200) + '...'}
        {isExpanded ? (
          <button className="text-secondary/70 hover:underline" onClick={() => setIsExpanded(false)}>View less</button>
        ) : (
          <button className="text-secondary/70 hover:underline" onClick={() => setIsExpanded(true)}>View more</button>
        )}
      </p>
    </div>
  )
}