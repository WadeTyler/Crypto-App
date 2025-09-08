import {type FormEvent, useState} from "react";
import {faEnvelope, faLock, faRightToBracket, faSignature, faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {login, register} from "../features/auth/auth.api.ts";


export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="page bg-gradient-to-tr from-background to-background-secondary/80">
      <div className="container mx-auto">
        <div className="flex items-center justify-center flex-col gap-8 m-auto max-w-xl w-full">
          {/* Mode Selector */}
          <ModeSelector mode={mode} setMode={setMode}/>
          {mode === "login" ? <LoginForm/> : <RegisterForm />}
        </div>
      </div>
    </div>
  )
}

function ModeSelector({mode, setMode}: {
  mode: "login" | "register",
  setMode: (mode: "login" | "register") => void
}) {
  const modeSelected = "bg-accent-hover shadow-accent shadow-md font-bold";

  return (
    <div className="bg-background-secondary w-full rounded-md h-8 flex items-center justify-between shadow-lg text-sm lg:text-base">
      <button
        onClick={() => setMode("login")}
        className={`w-full flex items-center justify-center gap-2 h-full cursor-pointer rounded-md duration-200 hover:bg-accent-hover hover:shadow-accent hover:shadow-md hover:font-bold ${mode === "login" && modeSelected}`}>
        <FontAwesomeIcon icon={faRightToBracket}/>
        Login
      </button>
      <button
        onClick={() => setMode("register")}
        className={`w-full flex items-center justify-center gap-2 h-full cursor-pointer rounded-md duration-200 hover:bg-accent-hover hover:shadow-accent hover:shadow-md hover:font-bold ${mode === "register" && modeSelected}`}>
        <FontAwesomeIcon icon={faUserPlus}/>
        Register
      </button>
    </div>
  )
}

function LoginForm() {
  const queryClient = useQueryClient();

  const {mutate, isPending, error} = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['authUser']});
    }
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    mutate({username, password});
  }

  return (
    <form className="w-full bg-background-secondary p-4 lg:p-8 shadow-xl rounded-md flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-2xl font-semibold text-center text-balance">Welcome back!</h2>
        <p className="text-center text-balance text-sm text-secondary">
          Enter your credentials to access your account.
        </p>
      </div>
      <div className="input-container">
        <label htmlFor="username" className="input-label">
          <FontAwesomeIcon icon={faEnvelope}/>
          Email:
        </label>
        <input type="email" className="input-bar"
               placeholder="Enter your email" name="username" id="username"
               required maxLength={255}
        />
      </div>

      <div className="input-container">
        <label htmlFor="password" className="input-label">
          <FontAwesomeIcon icon={faLock}/>
          Password:
        </label>
        <input type="password" className="input-bar"
               placeholder="Enter your password" name="password" id="password"
               required minLength={8} maxLength={100}
        />
      </div>

      {error && (
        <p className="text-center text-balance text-danger">{(error as Error).message}</p>
      )}

      <button type="submit" className="btn-1" disabled={isPending}>
        <FontAwesomeIcon icon={faRightToBracket}/>
        Login
      </button>
    </form>
  )
}

function RegisterForm() {
  const queryClient = useQueryClient();

  const {mutate, isPending, error} = useMutation({
    mutationFn: register,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['authUser']});
    }
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const password = formData.get("password") as string;
    const verifyPassword = formData.get("verifyPassword") as string;

    mutate({username, firstName, lastName, password, verifyPassword});
  }

  return (
    <form className="w-full bg-background-secondary p-4 lg:p-8 shadow-xl rounded-md flex flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-2xl font-semibold text-center text-balance">Let's get started!</h2>
        <p className="text-center text-balance text-sm text-secondary">
          Create an account to start managing your crypto portfolio.
        </p>
      </div>
      <div className="input-container">
        <label htmlFor="username" className="input-label">
          <FontAwesomeIcon icon={faEnvelope}/>
          Email:
        </label>
        <input type="email" className="input-bar"
               placeholder="Enter your email" name="username" id="username"
               required maxLength={255}
        />
      </div>

      <div className="input-container">
        <label htmlFor="firstName" className="input-label">
          <FontAwesomeIcon icon={faSignature} />
          First Name:
        </label>
        <input type="text" className="input-bar"
               placeholder="Enter your first name" name="firstName" id="firstName"
               required maxLength={255}
        />
      </div>

      <div className="input-container">
        <label htmlFor="lastName" className="input-label">
          <FontAwesomeIcon icon={faSignature} />
          Last Name:
        </label>
        <input type="text" className="input-bar"
               placeholder="Enter your last name" name="lastName" id="lastName"
               required maxLength={255}
        />
      </div>

      <div className="input-container">
        <label htmlFor="password" className="input-label">
          <FontAwesomeIcon icon={faLock}/>
          Password:
        </label>
        <input type="password" className="input-bar"
               placeholder="Enter your password" name="password" id="password"
               required minLength={8} maxLength={100}
        />
      </div>

      <div className="input-container">
        <label htmlFor="verifyPassword" className="input-label">
          <FontAwesomeIcon icon={faLock}/>
          Verify Password:
        </label>
        <input type="password" className="input-bar"
               placeholder="Verify your password" name="verifyPassword" id="verifyPassword"
               required minLength={8} maxLength={100}
        />
      </div>

      {error && (
        <p className="text-center text-balance text-danger">{(error as Error).message}</p>
      )}

      <button type="submit" className="btn-1" disabled={isPending}>
        <FontAwesomeIcon icon={faUserPlus}/>
        Register
      </button>
    </form>
  )
}