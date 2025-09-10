import {useQuery} from "@tanstack/react-query";
import {getCurrentUser} from "../features/auth/auth.api.ts";
import LoadingPage from "./LoadingPage.tsx";
import {getAllPortfolios, getPortfolioById} from "../features/portfolio/portfolio.api.ts";
import {LoadingSm} from "../components/LoadingSpinner.tsx";
import {useState} from "react";
import {getCoins} from "../features/coins/coin.api.ts";
import type {Holding} from "../features/portfolio/portfolio.types.ts";
import type {Coin} from "../features/coins/coin.types.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowTrendDown, faArrowTrendUp} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router";

export default function PortfolioPage() {
  // States
  const [targetPortfolioId, setTargetPortfolioId] = useState<number | null>(null);
  const [vs_currency] = useState(localStorage.getItem('vs_currency') || 'usd');

  // Query Data
  const {data: authUser, isLoading: loadingAuthUser} = useQuery({
    queryKey: ['authUser'],
    queryFn: getCurrentUser
  });

  const {data: portfolios, isLoading: loadingPortfolios, error: portfoliosError} = useQuery({
    queryKey: ['portfolios'],
    queryFn: getAllPortfolios
  });

  const {data: selectedPortfolio, isLoading: loadingSelectedPortfolio, error: errorSelectedPortfolio} = useQuery({
    queryKey: ['selectedPortfolio', targetPortfolioId],
    queryFn: async () => getPortfolioById(targetPortfolioId)
  });

  const {data: holdingsCoinData, isLoading: loadingHoldingsCoinData, error: holdingsCoinDataError} = useQuery({
    queryKey: ['holdingsCoinData', selectedPortfolio],
    queryFn: async () => {
      if (!selectedPortfolio) return null;
      const ids = selectedPortfolio.holdings.map(h => h.cryptoId).join(',');
      return getCoins({ids, page: 1, per_page: selectedPortfolio.holdings.length, vs_currency});
    }
  });

  // Functions

  function getCurrencySymbol() {
    return vs_currency === 'eur' ? '€' : '$';
  }

  // Calculate total value of the portfolio
  function calculateTotalValue() {
    if (!selectedPortfolio || !holdingsCoinData) return 0;
    return selectedPortfolio.holdings.reduce((total, holding) => {
      const coin = holdingsCoinData.find(c => c.id === holding.cryptoId);
      const price = coin ? coin.current_price : 0;
      return total + (holding.quantity * price);
    }, 0);
  }

  if (loadingAuthUser || loadingPortfolios) {
    return <LoadingPage/>;
  }

  return (
    <div className="page bg-gradient-to-tr from-background to-background-secondary/70">
      <div className="container flex flex-col gap-8">
        <div className="w-full flex flex-col gap-4">
          <h1
            className="text-accent text-shadow-md text-shadow-accent-hover lg:text-5xl md:text-4xl text-3xl font-semibold">Manage
            Portfolios</h1>
          <p className="text-secondary">Welcome back, {authUser?.firstName}!</p>
          {portfoliosError && (
            <p className="text-danger">{(portfoliosError as Error).message}</p>
          )}
          {loadingPortfolios && <LoadingSm/>}
          {portfolios && (
            <div className="flex items-center gap-4 ml-auto">

              <button className="btn-2">+</button>
              {/* Portfolio Selector */}
              <select name="portfolio" id="portfolio" className="btn-2"
                      onChange={(e) => setTargetPortfolioId(Number(e.target.value))}
              >
                <option value="" disabled selected>Select Portfolio</option>
                {portfolios.map((portfolio) => (
                  <option key={portfolio.id} value={portfolio.id}>{portfolio.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        {!targetPortfolioId && (
          <p className="text-secondary text-center">Please select a portfolio to view its details.</p>
        )}

        {(loadingSelectedPortfolio || loadingHoldingsCoinData) && <div className="mx-auto"><LoadingSm/></div>}
        {errorSelectedPortfolio && (
          <p className="text-danger text-center text-balance">{(errorSelectedPortfolio as Error).message}</p>
        )}
        {holdingsCoinDataError && (
          <p className="text-danger text-center text-balance">{(holdingsCoinDataError as Error).message}</p>
        )}
        {selectedPortfolio && holdingsCoinData && (
          <section
            className="flex flex-col gap-4 w-full bg-background rounded-md shadow-[0_0_10px_var(--color-accent)] p-4">
            <div>
              <h2 className="text-3xl font-semibold text-accent">
                {selectedPortfolio.name}
              </h2>
              <span className="text-4xl font-semibold">
                {getCurrencySymbol()}{calculateTotalValue().toFixed(2)}
              </span>
            </div>

            <hr/>

            {/* Display holdings */}
            <div className="flex flex-col gap-2">

              <div className="flex items-center gap-4 ml-auto">
                <button className="btn-2">
                  Add Transaction
                </button>
              </div>

              <h3 className="text-2xl font-semibold">Holdings</h3>
              {selectedPortfolio.holdings.length === 0 && (
                <p className="text-secondary/70 text-center text-sm">You do not currently have any holdings
                  in {selectedPortfolio.name}.</p>
              )}

              {selectedPortfolio.holdings.map((holding) => (
                <HoldingDisplay key={holding.cryptoId} holding={holding}
                                coinData={holdingsCoinData.find(c => c.id === holding.cryptoId)}
                                currencySymbol={getCurrencySymbol()}/>
              ))}
            </div>


          </section>
        )}


      </div>

    </div>
  )
}

function HoldingDisplay({holding, coinData, currencySymbol}: {
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
            <span className={coinData?.market_cap_change_percentage_24h && coinData.market_cap_change_percentage_24h > 0 ? "text-green-400" : 'text-danger'}>
              Change 24h: {coinData?.market_cap_change_percentage_24h}%
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}