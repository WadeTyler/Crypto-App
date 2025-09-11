import {useQuery} from "@tanstack/react-query";
import {getCoins} from "../features/coins/coin.api.ts";
import {type ChangeEvent, useState} from "react";
import {LoadingMd} from "../components/LoadingSpinner.tsx";
import type {Coin} from "../features/coins/coin.types.ts";
import {
  faArrowTrendDown,
  faArrowTrendUp,
  faCaretLeft,
  faCaretRight,
  faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router";

export default function HomePage() {
  return (
    <div className="page bg-gradient-to-tr from-background to-background-secondary/80">
      <div className="container mx-auto flex flex-col items-center gap-16">
        <div className="mx-auto max-w-4xl text-center text-balance flex flex-col items-center justify-center">
          <h1
            className="lg:text-7xl text-5xl font-bold text-accent text-shadow-lg text-shadow-accent/30">
            The #1 Crypto Portfolio Tracker
          </h1>
          <p className="mt-4 md:text-lg text-secondary max-w-2xl">
            Track your favorite cryptocurrencies and manage your portfolio with ease. Stay updated with real-time prices
            and market trends. Join thousands of users who trust our platform for their crypto investments. Start
            tracking today!
          </p>
        </div>

        {/* Coins List */}
        <CoinsList/>

      </div>
    </div>
  )
}

function CoinsList() {

  // States
  const [vs_currency, setVsCurrency] = useState(localStorage.getItem("vs_currency") || "usd");
  const [page, setPage] = useState(1);
  const [per_page, setPerPage] = useState(50);

  // Fetch coins
  const {data: coins, isLoading: isLoadingCoins, error: loadCoinsError} = useQuery({
    queryKey: ['coins', vs_currency, page, per_page],
    queryFn: () => getCoins({vs_currency, per_page, page})
  });


  // Functions
  function handleCurrencyChange(e: ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    setVsCurrency(e.target.value);
    localStorage.setItem("vs_currency", e.target.value);
  }

  function handlePerPageChange(e: ChangeEvent<HTMLSelectElement>) {
    e.preventDefault();
    setPerPage(Number(e.target.value));
  }

  function handlePageChange(newPage: number) {
    if (newPage < 1) return;
    setPage(newPage);
  }

  if (loadCoinsError) {
    return (
      <p className="text-danger text-balance text-center">
        {(loadCoinsError as Error).message || "Failed to load coins. Please try again later."}
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full mx-auto">
      <div className="flex w-full gap-4 items-center justify-between">
        {/* Search Bar */}
        <form className="flex items-center justify-between w-full input-bar p-0! overflow-hidden">
          <input type="text" className="w-full px-3 py-2 focus:outline-none"
                 placeholder="Search by coin name..."
          />
          <button type="submit" className="flex items-center justify-center">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="px-3 py-2"/>
            <span className="sr-only">Search</span>
          </button>
        </form>

        {/* Currency Selector */}
        <select id="currency-selector" className="input-bar" name="currency" onChange={handleCurrencyChange} value={vs_currency}>
          <option value="usd">$ USD</option>
          <option value="eur">€ EUR</option>
        </select>

        {/* Per Page Selector */}
        <select id="per-page-selector" name="per_page" className="input-bar" onChange={handlePerPageChange} value={per_page}>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
          <option value="200">200 per page</option>
        </select>

        {/* Pagination */}
        <div className="items-center justify-center gap-4 w-fit hidden lg:flex">
          <button className="btn-2" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
            <FontAwesomeIcon icon={faCaretLeft} />
            <span>Prev</span>
          </button>

          <div className="bg-background px-3 py-2 rounded-md shadow-md border-accent border">{page}</div>

          <button className="btn-2" onClick={() => handlePageChange(page + 1)}>
            <span>Next</span>
            <FontAwesomeIcon icon={faCaretRight} />
          </button>
        </div>
      </div>

      <div
        className="flex flex-col items-center justify-center rounded-md bg-background-secondary w-full overflow-hidden border-accent border shadow-[0_0_20px_var(--color-accent)]"
      >
        {isLoadingCoins && <LoadingMd/>}
        {coins && !isLoadingCoins && coins.map((coin) => (
          <CoinRow coin={coin} key={coin.id}/>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4 w-fit">
        <button className="btn-2" disabled={page === 1} onClick={() => handlePageChange(page - 1)}>
          <FontAwesomeIcon icon={faCaretLeft} />
          <span>Prev</span>
        </button>

        <div className="bg-background px-3 py-2 rounded-md shadow-md border-accent border">{page}</div>

        <button className="btn-2" onClick={() => handlePageChange(page + 1)}>
          <span>Next</span>
          <FontAwesomeIcon icon={faCaretRight} />
        </button>
      </div>

    </div>
  )
}

function CoinRow({coin}: { coin: Coin }) {
  const navigate = useNavigate();

  const currencySymbol = localStorage.getItem("vs_currency") === "eur" ? "€" : "$";

  return (
    <div
      onClick={() => navigate(`/coins/${coin.id}`)}
      className="w-full p-4 border-b-accent border-b last-of-type:border-b-0 flex items-center justify-between hover:bg-accent-hover duration-200 cursor-pointer">
      <div className="flex items-center space-x-4">
        <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full shadow-md"/>
        <span>{coin.name}</span>
        <span className='text-secondary/70 text-sm'>#{coin.market_cap_rank}</span>
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

        <span className="text-secondary">{currencySymbol}{coin.current_price.toLocaleString()}</span>
      </div>

    </div>
  )
}