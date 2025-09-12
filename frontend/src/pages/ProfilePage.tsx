import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteAccount, logout} from "../features/auth/auth.api.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {type FormEvent, useState} from "react";
import {LoadingSm} from "../components/LoadingSpinner.tsx";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const {mutate: logoutMutation, isPending: isLoggingOut} = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      console.log("Logged out successfully");
      await queryClient.setQueryData(['authUser'], null);
    },
    onError: (err) => {
      console.error("Logout failed:", err);
    }
  })

  return (
    <div className="page">
      <div className="container mx-auto flex flex-col gap-8">
        <div>
          <h1 className="lg:text-4xl text-3xl font-semibold text-accent">Profile Page</h1>
          <p className="text-secondary/70">
            View and manage your profile information here.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8">

          <div className="w-full rounded-md bg-background-secondary p-4 shadow-[0_0_10px_var(--color-accent)] h-full flex flex-col gap-4">
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              <h2 className="text-2xl font-semibold">
                Logout
              </h2>
            </span>
            <button onClick={() => logoutMutation()} disabled={isLoggingOut} className="btn-1">
              Logout
            </button>
          </div>

          <div className="w-full rounded-md bg-background-secondary p-4 shadow-[0_0_10px_var(--color-accent)] h-full flex flex-col gap-4">
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
              <h2 className="text-2xl font-semibold">
                Delete Account
              </h2>
            </span>
            <button onClick={() => setDeleteAccountOpen(true)} className="btn-danger">
              Delete Account
            </button>
          </div>
        </div>

      </div>
      {deleteAccountOpen && <DeleteAccountForm closeForm={() => setDeleteAccountOpen(false)} />}
    </div>
  )
}


function DeleteAccountForm({closeForm}: {closeForm: () => void}) {
  const queryClient = useQueryClient();

  const {mutate, isPending, error} = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await queryClient.setQueryData(['authUser'], null);
      closeForm();
    }
  })

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutate();
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
          <h2 className="text-2xl font-semibold">Delete Account</h2>
          <p className="text-sm text-secondary/70">
            You are about to delete your account. This action is irreversible.
            Please confirm your decision by clicking the button below.
          </p>
        </div>

        {error && (
          <p className="text-danger text-center text-balance">{(error as Error).message}</p>
        )}

        <div className="flex gap-4 ml-auto">
          <button type="button" className="btn-2" onClick={closeForm} disabled={isPending}>
            Cancel
          </button>
          <button type="submit" className="btn-danger" disabled={isPending}>
            {isPending ? <LoadingSm/> : "Delete Account"}
          </button>
        </div>
      </form>
    </div>
  );
}