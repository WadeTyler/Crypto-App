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
  faMagnifyingGlass,
  faShieldHalved,
  faChartLine,
  faClock,
  faWallet
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate, Link} from "react-router";
import type {IconDefinition} from "@fortawesome/free-regular-svg-icons";

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

          {/* Primary CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link to="/portfolio" className="btn-2">
              Get Started — It’s Free
            </Link>
            <Link to="/auth" className="btn-2">
              Sign In / Create Account
            </Link>
          </div>
        </div>

        {/* Feature highlights */}
        <section aria-labelledby="features-heading" className="w-full">
          <h2 id="features-heading" className="sr-only">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard
              icon={faChartLine}
              title="Real‑Time Prices"
              description="Live market data for Bitcoin, Ethereum, and thousands of altcoins."
            />
            <FeatureCard
              icon={faWallet}
              title="Smart Portfolio"
              description="Track holdings and performance at a glance."
            />
            <FeatureCard
              icon={faClock}
              title="Lightning‑Fast"
              description="Snappy UI built for a smooth tracking experience."
            />
            <FeatureCard
              icon={faShieldHalved}
              title="Privacy‑Friendly"
              description="Your data stays yours. No spam. No nonsense."
            />
          </div>
          <p className="mt-6 text-center text-secondary max-w-4xl mx-auto text-balance">
            Our crypto portfolio tracker helps you analyze your investments with real‑time price charts, market caps,
            and 24h performance. Optimize your strategy with timely insights across BTC, ETH, and the top coins.
          </p>
        </section>

        {/* Coins List */}
        <CoinsList/>

        {/* FAQ Section */}
        <section aria-labelledby="faq-heading" className="w-full max-w-4xl mx-auto">
          <h2 id="faq-heading" className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <details className="rounded-md border border-accent bg-background-secondary p-4">
              <summary className="cursor-pointer font-medium">Is this crypto portfolio tracker free?</summary>
              <div className="mt-2 text-secondary">
                Yes. You can start tracking your portfolio for free with real‑time market data.
              </div>
            </details>
            <details className="rounded-md border border-accent bg-background-secondary p-4">
              <summary className="cursor-pointer font-medium">Which coins are supported?</summary>
              <div className="mt-2 text-secondary">
                We cover major assets like Bitcoin (BTC), Ethereum (ETH), and thousands of altcoins with up‑to‑date prices.
              </div>
            </details>
            <details className="rounded-md border border-accent bg-background-secondary p-4">
              <summary className="cursor-pointer font-medium">Can I view price changes and charts?</summary>
              <div className="mt-2 text-secondary">
                Yes. You can see 24h price changes, trends, and navigate to coin detail pages for deeper insights.
              </div>
            </details>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="w-full text-center">
          <p className="text-secondary">Ready to take control of your crypto investments?</p>
          <div className="mt-3 flex gap-3 justify-center">
            <Link to="/portfolio" className="btn-2">Create Your Portfolio</Link>
            <Link to="/coins/bitcoin" className="btn-2">Explore Bitcoin</Link>
          </div>
        </div>

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

// Lightweight feature card component
function FeatureCard({ icon, title, description }: { icon: IconDefinition; title: string; description: string }) {
  return (
    <div className="rounded-md border border-accent bg-background-secondary p-5 h-full">
      <div className="flex items-start gap-3">
        <div className="text-accent">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-secondary mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}