import {useQuery} from "@tanstack/react-query";
import {getCoins} from "../features/coins/coin.api.ts";
import {useEffect, useState} from "react";
import {LoadingMd} from "../components/LoadingSpinner.tsx";
import type {Coin} from "../features/coins/coin.types.ts";
import {faArrowTrendDown, faArrowTrendUp, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function HomePage() {

  const [vs_currency, setVsCurrency] = useState("usd");
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(50);

  const {data: coins, isLoading: isLoadingCoins, error: loadCoinsError} = useQuery({
    queryKey: ['coins', vs_currency, page, per_page],
    queryFn: () => getCoins({vs_currency, per_page, page})
  });

  useEffect(() => {
    console.log("Coins: " + coins);
  }, [coins]);

  useEffect(() => {

    if (loadCoinsError) {
      console.error("Error loading coins: ", loadCoinsError);
    }
  }, [loadCoinsError]);

  return (
    <div className="page bg-gradient-to-tr from-background to-background-secondary/80">
      <div className="container mx-auto flex flex-col items-center gap-16">
        <div className="mx-auto max-w-4xl text-center text-balance flex flex-col items-center justify-center">
          <h1
            className="lg:text-5xl md:text-4xl text-3xl font-bold text-accent text-shadow-md text-shadow-accent/20">
            The number 1 Crypto Portfolio Tracker
          </h1>
          <p className="mt-4 md:text-lg text-secondary max-w-2xl">
            Track your favorite cryptocurrencies and manage your portfolio with ease. Stay updated with real-time prices
            and market trends. Join thousands of users who trust our platform for their crypto investments. Start
            tracking today!
          </p>
        </div>

        <div className="flex flex-col items-center gap-16 w-full mx-auto">

          <form className="flex items-center justify-between w-full input-bar p-0! overflow-hidden">
            <input type="text" className="w-full px-3 py-2 focus:outline-none"
                   placeholder="Search by coin name..."
            />
            <button type="submit" className="flex items-center justify-center">
              <FontAwesomeIcon icon={faMagnifyingGlass}  className="px-3 py-2"/>
              <span className="sr-only">Search</span>
            </button>
          </form>

          {/* Coins List */}
          <div
            className="flex flex-col items-center justify-center rounded-md shadow-md bg-background-secondary w-full overflow-hidden">
            {isLoadingCoins && <LoadingMd/>}
            {coins && !isLoadingCoins && coins.map((coin) => (
              <CoinRow coin={coin} key={coin.id}/>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function CoinRow({coin}: { coin: Coin }) {
  return (
    <div
      className="w-full p-4 border-b-accent border-b last-of-type:border-b-0 flex items-center justify-between hover:bg-accent-hover duration-200 cursor-pointer">
      <div className="flex items-center space-x-4">
        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full shadow-md"/>
        <span>{coin.name}</span>
      </div>

      <div className="text-right flex items-center gap-4">
        {/* price change 24 h percentage*/}
        <span
          className={`flex gap-2 items-center text-shadow-2xs ${coin.price_change_percentage_24h > 0 ? "text-green-400 text-shadow-green-00" : "text-danger text-shadow-danger"}`}
        >
          {coin.price_change_percentage_24h < 0 ? <FontAwesomeIcon icon={faArrowTrendDown}/> :
            <FontAwesomeIcon icon={faArrowTrendUp}/>}
          {coin.price_change_percentage_24h}%
        </span>

        <span className="text-secondary">${coin.current_price.toLocaleString()}</span>
      </div>

    </div>
  )
}