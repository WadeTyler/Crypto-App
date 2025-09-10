import {type FormEvent, useState} from "react";
import type {SearchCoin} from "../../features/coins/coin.types.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {searchCoins} from "../../features/coins/coin.api.ts";
import {LoadingSm} from "../LoadingSpinner.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDeleteLeft, faHandshake, faX} from "@fortawesome/free-solid-svg-icons";
import type {Portfolio} from "../../features/portfolio/portfolio.types.ts";
import {createTransaction} from "../../features/portfolio/transaction/transaction.api.ts";

export default function CreateTransactionForm({selectedPortfolio, closeForm}: {
  selectedPortfolio: Portfolio,
  closeForm: () => void
}) {

  const queryClient = useQueryClient();

  // States
  const [query, setQuery] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [selectedCoin, setSelectedCoin] = useState<SearchCoin | null>(null);

  const {data: searchResult, isLoading: isSearching, error: searchError} = useQuery({
    queryKey: ['searchResults', query],
    queryFn: () => {
      if (query.length < 2) return {coins: [], cachedAt: ''};
      return searchCoins(query);
    }
  });

  const {
    mutate: handleCreateTransaction,
    isPending: isCreatingTransaction,
    error: createTransactionError
  } = useMutation({
    mutationFn: createTransaction,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['selectedPortfolio', selectedPortfolio.id]});
      closeForm();
    }
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!selectedCoin) {
      console.log('Please select a coin');
      return;
    }


    const formData = new FormData(e.target as HTMLFormElement);
    const type = formData.get('type') as "buy" | "sell";
    const quantity = parseFloat(formData.get('quantity') as string);
    const price = parseFloat(formData.get('price') as string);
    const fee = parseFloat(formData.get('fee') as string);
    const cryptoId = selectedCoin.id;

    handleCreateTransaction({
      portfolioId: selectedPortfolio.id,
      createRequest: {
        type, quantity, price, fee, cryptoId
      }
    });
  }

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-screen bg-black/50 flex items-center justify-center p-8"
         onClick={(e) => {
           if (e.target === e.currentTarget) {
             closeForm();
           }
         }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full bg-background rounded-md border border-accent shadow-[0_0_10px_var(--color-accent)] p-8 flex flex-col gap-4">
        <div className="flex items-center gap-4 justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Create a Transaction</h2>
            <p className="text-sm text-secondary/70">
              Transactions are how you manage your portfolio holdings. You can create buy and sell transactions to
              update
              your holdings.
            </p>
          </div>

          <button type="button"
                  onClick={closeForm}
                  className="btn-2 p-2!"
          >
            <FontAwesomeIcon icon={faX}/>
          </button>
        </div>

        {/* Search Section */}
        {!selectedCoin && (
          <div>
            <input type="text" placeholder="Search for coin"
                   autoFocus
                   className="input-bar w-full"
                   onChange={(e) => setQuery(e.target.value)}
                   onFocus={() => {
                     setSearchFocused(true);
                   }}
                   onBlur={() => {
                     setSearchFocused(false);
                   }}
            />
            {searchFocused && (
              <div
                className="flex flex-col max-h-48 overflow-y-auto p-4 border-l border-b border-r border-accent rounded-b-md gap-1 duration-200">
                {isSearching && <LoadingSm/>}
                {searchError && (
                  <p className="text-danger text-center text-balance">{(searchError as Error).message}</p>
                )}
                {searchResult && searchResult.coins.length === 0 && (
                  <p className="text-secondary/70 text-center text-balance text-sm">
                    No coins found. Try a different search term.
                  </p>
                )}
                {searchResult && searchResult.coins.length > 0 && (
                  searchResult.coins.map(coin => (
                    <div key={coin.id}
                         onMouseDown={(e) => {
                           e.preventDefault();
                           setSelectedCoin(coin);
                           setSearchFocused(false);
                           setQuery('');
                         }}
                         className="flex items-center gap-4 hover:bg-accent/50 p-2 rounded-md cursor-pointer"
                    >
                      <img src={coin.thumb} alt={coin.name} className="w-6 h-6"/>
                      <span>{coin.name}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {selectedCoin && (
          <>
            {/* Show Coin */}
            <div className="flex gap-4 items-center">
              <div
                className="flex items-center gap-4 rounded-md w-full p-2 hover:bg-danger/50 cursor-pointer duration-200 group"
                onClick={() => setSelectedCoin(null)}
              >
                <img src={selectedCoin.thumb} alt={selectedCoin.name} className="w-6 h-6"/>
                <span>{selectedCoin.name}</span>
                <FontAwesomeIcon icon={faDeleteLeft} className="ml-auto"/>
              </div>
            </div>

            {/* Transaction Details */}

            <div className="input-container">
              <label htmlFor="type" className="input-label">Transaction Type</label>
              <select id="type" name="type" className="input-bar w-full" required>
                <option value="buy">Buy</option>
                <option value="sell">Sell</option>
              </select>
            </div>

            <div className="input-contaner">
              <label htmlFor="quantity" className="input-label">Quantity</label>
              <input type="number" id="quantity" name="quantity" className="input-bar w-full" min="0" step="any"
                     required placeholder="Please enter quantity"/>
            </div>

            <div className="input-contaner">
              <label htmlFor="price" className="input-label">Price per Coin</label>
              <input type="number" id="price" name="price" className="input-bar w-full" min="0" step="any" required
                     placeholder="Please enter price per coin"/>
            </div>

            <div className="input-contaner">
              <label htmlFor="fee" className="input-label">Fee</label>
              <input type="number" id="fee" name="fee" className="input-bar w-full" min="0" step="any" required
                     placeholder="Please enter fee (if applicable)" defaultValue={0}/>
            </div>

            {createTransactionError && (
              <p className="text-danger text-center text-balance">{(createTransactionError as Error).message}</p>
            )}

            <button className="btn-1" type="submit" disabled={isCreatingTransaction}>
              {isCreatingTransaction ? <LoadingSm/> : (
                <>
                  <FontAwesomeIcon icon={faHandshake}/>
                  Create Transaction
                </>
              )}
            </button>
          </>
        )}

      </form>

    </div>
  );
}