import type {Portfolio} from "../../features/portfolio/portfolio.types.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deletePortfolioById} from "../../features/portfolio/portfolio.api.ts";
import type {FormEvent} from "react";
import {LoadingSm} from "../LoadingSpinner.tsx";

export default function DeletePortfolioForm({closeForm, selectedPortfolio, resetTargetPortfolioId}: {
  closeForm: () => void;
  selectedPortfolio: Portfolio;
  resetTargetPortfolioId: () => void;
}) {

  const queryClient = useQueryClient();

  const {mutate: deleteMutate, isPending: isDeleting, error: deleteError  } = useMutation({
    mutationFn: deletePortfolioById,
    onSuccess: async () => {
      resetTargetPortfolioId();
      await queryClient.invalidateQueries({queryKey: ['portfolios']});
      await queryClient.invalidateQueries({queryKey: ['selectedPortfolio']})
      closeForm();
    }
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    deleteMutate(selectedPortfolio.id);
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
          <h2 className="text-2xl font-semibold">Delete Portfolio</h2>
          <p className="text-sm text-secondary/70">
            You are about to delete the portfolio <strong>{selectedPortfolio.name}</strong>. This action is
            irreversible and will remove all associated holdings and transactions. Please confirm your decision.
          </p>
        </div>

        {deleteError && (
          <p className="text-danger text-center text-balance">{(deleteError as Error).message}</p>
        )}

        <div className="flex gap-4 ml-auto">
          <button type="button"
                  disabled={isDeleting}
                  onClick={closeForm}
                  className="btn-2"
          >
            Cancel
          </button>
          <button type="submit"
                  disabled={isDeleting}
                  className="btn-danger"
          >
            {isDeleting ? <LoadingSm /> : "Confirm Delete"}
          </button>

        </div>
      </form>
    </div>
  )
}