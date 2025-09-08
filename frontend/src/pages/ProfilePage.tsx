import {useMutation, useQueryClient} from "@tanstack/react-query";
import {logout} from "../features/auth/auth.api.ts";

export default function ProfilePage() {
  const queryClient = useQueryClient();

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
      <div className="container mx-auto">
        <h1>Profile Page</h1>
        <button className="btn-1" onClick={() => logoutMutation()} disabled={isLoggingOut}>
          Logout
        </button>
      </div>
    </div>
  )
}