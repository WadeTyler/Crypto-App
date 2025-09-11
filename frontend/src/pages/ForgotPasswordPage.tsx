import {useMutation} from "@tanstack/react-query";
import {changePassword, forgotPassword} from "../features/auth/auth.api.ts";
import {LoadingSm} from "../components/LoadingSpinner.tsx";
import {type FormEvent, useState} from "react";
import {useNavigate, useSearchParams} from "react-router";

export default function ForgotPasswordPage() {

  const [searchParams] = useSearchParams();
  const username = searchParams.get("username") ?? "";

  return (
    <div className="page bg-gradient-to-tl from-background to-background-secondary/50">
      <div className="container mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-4 text-center items-center">
          <h1 className="text-accent lg:text-4xl md:text-3xl text-2xl font-semibold">Forgot Password</h1>
          <p className="max-w-2xl text-sm text-secondary/70">
            Forgot your password? Don't worry, it happens to the best of us. To reset your password, please follow these
            steps:
          </p>
        </div>
        {!username ? (
          <GetCodeForm />
        ) : (
          <ChangePasswordForm username={username} />
        )}


      </div>

    </div>
  )
}

function GetCodeForm() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const {mutate: handleForgotPassword, isPending: isGettingCode, error: getCodeError} = useMutation({
    mutationFn: forgotPassword,
    onSuccess: async () => {
      await navigate(`/auth/forgot-password?username=${username}`);
    }
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    handleForgotPassword(username);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-md shadow-[0_0_10px_var(--color-accent)] mx-auto bg-background p-4"
    >
      <p>
        Enter your email address below and we'll send you a code to reset your password.
      </p>

      <div className="input-container">
        <label htmlFor="username" className="input-label">Username:</label>
        <input type="email" className="input-bar" id="username" name="username"
               required
               maxLength={255}
               placeholder="Enter your email address"
               value={username}
               onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {getCodeError && (
        <p className="text-danger text-center text-balance">{(getCodeError as Error).message}</p>
      )}

      <button type="submit" className="btn-1" disabled={isGettingCode}>
        {isGettingCode ? <LoadingSm/> : "Send Reset Code"}
      </button>
    </form>
  )
}

function ChangePasswordForm({username}: ({
  username: string;
})) {

  const navigate = useNavigate();

  async function handleGoBack() {
    await navigate("/auth/forgot-password");
  }

  const {mutate: handleChangePassword, isPending: isChanging, error: changeError} = useMutation({
    mutationFn: changePassword,
    onSuccess: async () => {
      await navigate("/auth");
    }
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const code = formData.get("code") as string;
    const newPassword = formData.get("newPassword") as string;
    const verifyNewPassword = formData.get("verifyNewPassword") as string;
    handleChangePassword({code, username, newPassword, verifyNewPassword});
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-md shadow-[0_0_10px_var(--color-accent)] mx-auto bg-background p-4"
    >
      <p>
        A reset code has been sent to {username}. Please check your email and follow the instructions to reset your
        password.
      </p>

      <div className="input-container">
        <label htmlFor="code" className="input-label">Code:</label>
        <input type="text" className="input-bar" required id="code" name="code"
               placeholder="Enter the code you received"/>
      </div>

      <div className="input-container">
        <label htmlFor="newPassword" className="input-label">New Password:</label>
        <input type="password" className="input-bar" required id="newPassword" name="newPassword"
               maxLength={100}
               placeholder="Enter new password"/>
      </div>

      <div className="input-container">
        <label htmlFor="verifyNewPassword" className="input-label">Verify New Password:</label>
        <input type="password" className="input-bar" required id="verifyNewPassword" name="verifyNewPassword"
               maxLength={100}
               placeholder="Verify new password"/>
      </div>

      {changeError && (
        <p className="text-danger text-center text-balance">{(changeError as Error).message}</p>
      )}

      <div className="flex items-center ml-auto gap-4">
        <button type="button" className="btn-2" onClick={handleGoBack} disabled={isChanging}>
          Back
        </button>
        <button type="submit" className="btn-1" disabled={isChanging}>
          {isChanging ? <LoadingSm/> : "Change Password"}
        </button>
      </div>

    </form>
  )
}