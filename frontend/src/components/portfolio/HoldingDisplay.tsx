import type {Holding} from "../../features/portfolio/portfolio.types.ts";
import type {Coin} from "../../features/coins/coin.types.ts";
import {Link} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowTrendDown, faArrowTrendUp} from "@fortawesome/free-solid-svg-icons";

export default function HoldingDisplay({holding, coinData, currencySymbol}: {
  holding: Holding,
  coinData: Coin | undefined,
  currencySymbol: string
}) {
  return (
    <div className="flex flex-col gap-2 bg-background-secondary/50 shadow-md rounded-md p-4">
      <div className="flex md:items-center justify-between gap-4 md:flex-row flex-col">
        <div className="flex items-center gap-4">
          <img src={coinData?.image} alt={coinData?.name} className="w-12 h-12"/>
          <h4 className="font-semibold text-xl">{coinData?.name}</h4>
          <Link to={`/coins/${coinData?.id}`}
                className="text-sm text-secondary/70 underline hover:text-accent duration-200" target="_blank">
            (View Details)
          </Link>
        </div>
        <div className='md:text-end'>
          <span className="text-xl font-semibold text-shadow-accent text-shadow-md">
           {currencySymbol}{(holding.quantity * (coinData?.current_price || 0)).toFixed(2)}
          </span>
          <span className="text-secondary/70 block text-xs">
            (Quantity: {holding.quantity})
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 text-sm">
        {/* Current Price */}
        <div className="p-4 flex flex-col gap-2 bg-secondary/10 rounded-md shadow-md">
          <h5 className="text-secondary/70 font-semibold">Current Price</h5>
          <span className="font-semibold text-lg">{currencySymbol}{coinData?.current_price.toFixed(2)}</span>
          <div className="flex items-center gap-2 justify-between text-secondary/70 text-xs">
            <span>ATH: {currencySymbol}{coinData?.ath}</span>
            <span>ATL: {currencySymbol}{coinData?.atl}</span>
          </div>
        </div>

        {/* Price Change 24h */}
        <div className="p-4 flex flex-col gap-2 bg-secondary/10 rounded-md shadow-md">
          <h5 className="text-secondary/70 font-semibold">Price Change 24h</h5>
          <span
            className={`font-semibold text-lg flex items-center gap-2 ${coinData?.price_change_percentage_24h && coinData.price_change_percentage_24h > 0 ? "text-green-400" : 'text-danger'}`}>
            {coinData?.price_change_percentage_24h && coinData.price_change_percentage_24h > 0 ? (
              <FontAwesomeIcon icon={faArrowTrendUp}/>
            ) : <FontAwesomeIcon icon={faArrowTrendDown}/>}
            {coinData?.price_change_percentage_24h}%
          </span>
          <span className="text-secondary/70 block text-sm">{currencySymbol}{coinData?.price_change_24h}</span>
        </div>

        {/* Market Cap */}
        <div className="p-4 flex flex-col gap-2 bg-secondary/10 rounded-md shadow-md">
          <h5 className="text-secondary/70 font-semibold">Market Cap</h5>
          <span className="font-semibold text-lg">{currencySymbol}{coinData?.market_cap}</span>
          <div className="flex items-center gap-2 justify-between text-secondary/70 text-xs">
            <span>Rank: #{coinData?.market_cap_rank}</span>
            <span
              className={coinData?.market_cap_change_percentage_24h && coinData.market_cap_change_percentage_24h > 0 ? "text-green-400" : 'text-danger'}>
              Change 24h: {coinData?.market_cap_change_percentage_24h}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}