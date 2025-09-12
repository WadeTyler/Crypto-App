import {useQuery} from "@tanstack/react-query";
import {getCurrentUser} from "../features/auth/auth.api.ts";
import LoadingPage from "./LoadingPage.tsx";
import {getAllPortfolios, getPortfolioById} from "../features/portfolio/portfolio.api.ts";
import {LoadingSm} from "../components/LoadingSpinner.tsx";
import {useState} from "react";
import {getCoins} from "../features/coins/coin.api.ts";
import CreateTransactionForm from "../components/portfolio/CreateTransactionForm.tsx";
import HoldingDisplay from "../components/portfolio/HoldingDisplay.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBriefcase, faHandshake, faTrash} from "@fortawesome/free-solid-svg-icons";
import DeletePortfolioForm from "../components/portfolio/DeletePortfolioForm.tsx";
import CreatePortfolioForm from "../components/portfolio/CreatePortfolioForm.tsx";

export default function PortfolioPage() {
  // States
  const [targetPortfolioId, setTargetPortfolioId] = useState<number | null>(null);
  const [vs_currency] = useState(localStorage.getItem('vs_currency') || 'usd');

  // Form States
  const [createTransactionOpen, setCreateTransactionOpen] = useState<boolean>(false);
  const [deletePortfolioOpen, setDeletePortfolioOpen] = useState<boolean>(false);
  const [createPortfolioOpen, setCreatePortfolioOpen] = useState<boolean>(false);

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

              {/* Create Portfolio Button */}
              <button className="btn-2" onClick={() => setCreatePortfolioOpen(true)}>
                <FontAwesomeIcon icon={faBriefcase}/>
                Create Portfolio
              </button>

              {/* Portfolio Selector */}
              <select name="portfolio" id="portfolio" className="btn-2"
                      onChange={(e) => setTargetPortfolioId(Number(e.target.value))}
                      value={targetPortfolioId || ""}
              >
                <option value="" disabled selected>Select Portfolio</option>
                {portfolios.map((portfolio) => (
                  <option key={portfolio.id} value={portfolio.id}>{portfolio.name}</option>
                ))}
              </select>

              {/* Delete Portfolio Button */}
              {selectedPortfolio && (
                <button
                  className="hover:text-danger p-1 rounded-md hover:border-danger border border-transparent cursor-pointer"
                  title="Delete Portfolio"
                  onClick={() => setDeletePortfolioOpen(true)}
                >
                  <FontAwesomeIcon icon={faTrash}/>
                </button>
              )}
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
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 ml-auto">
                <button className="btn-2" onClick={() => setCreateTransactionOpen(true)}>
                  <FontAwesomeIcon icon={faHandshake}/>
                  Create Transaction
                </button>
              </div>

              <h3 className="text-2xl font-semibold">Holdings</h3>
              {selectedPortfolio.holdings.length === 0 && (
                <p className="text-secondary/70 text-center text-balance text-sm">You do not currently have any holdings
                  in {selectedPortfolio.name}. Create a transaction to get started.</p>
              )}

              {selectedPortfolio.holdings.map((holding) => (
                <HoldingDisplay key={holding.cryptoId} holding={holding}
                                coinData={holdingsCoinData.find(c => c.id === holding.cryptoId)}
                                currencySymbol={getCurrencySymbol()}/>
              ))}
            </div>
          </section>
        )}

        <p className="text-secondary text-xs ml-auto">
          Powered by <a href="https://www.coingecko.com/en/api" target="_blank" className="text-accent hover:underline hover:text-accent-hover duration-200">CoinGecko API</a>
        </p>
      </div>

      {createTransactionOpen && selectedPortfolio && (
        <CreateTransactionForm selectedPortfolio={selectedPortfolio} closeForm={() => setCreateTransactionOpen(false)}/>
      )}
      {deletePortfolioOpen && selectedPortfolio && (
        <DeletePortfolioForm closeForm={() => setDeletePortfolioOpen(false)}
                             selectedPortfolio={selectedPortfolio}
                             resetTargetPortfolioId={() => setTargetPortfolioId(null)}
        />
      )}
      {createPortfolioOpen && (
        <CreatePortfolioForm closeForm={() => setCreatePortfolioOpen(false)}
                             setTargetPortfolioId={setTargetPortfolioId}
        />
      )}

    </div>
  )
}