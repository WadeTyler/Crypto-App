import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createPortfolio} from "../../features/portfolio/portfolio.api.ts";
import type {FormEvent} from "react";
import type {Portfolio} from "../../features/portfolio/portfolio.types.ts";

export default function CreatePortfolioForm({closeForm, setTargetPortfolioId}: {
  closeForm: () => void;
  setTargetPortfolioId: (id: number | null) => void;
}) {

  const queryClient = useQueryClient();

  const {mutate: createMutate, isPending: isCreating, error: createError} = useMutation({
    mutationFn: createPortfolio,
    onSuccess: async (portfolio: Portfolio) => {
      await queryClient.invalidateQueries({queryKey: ['portfolios']});
      setTargetPortfolioId(portfolio.id);
      closeForm();
    }
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    if (!name) {
      return;
    }

    createMutate(name);
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
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Create Portfolio</h2>
          <p className="text-sm text-secondary/70">

          </p>
        </div>

        <div className="input-container">
          <label htmlFor="name" className="input-label">Name</label>
          <input type="text" className="input-bar" placeholder="Enter portfolio name" required name="name" id="name"
                 disabled={isCreating} maxLength={255} />
        </div>

        {createError && (
          <p className="text-danger text-center text-balance">{(createError as Error).message}</p>
        )}

        <div className="flex gap-4 ml-auto">
          <button type="button" className="btn-2" disabled={isCreating}>
            Cancel
          </button>
          <button type="submit" className="btn-1" disabled={isCreating}>
            Create Portfolio
          </button>
        </div>

      </form>
    </div>
  )
}