import type {AppUser, LoginRequest, RegisterRequest} from "./auth.types.ts";

const API_URL = import.meta.env.VITE_BASE_API_URL;

export async function getCurrentUser(): Promise<AppUser> {
  const response = await fetch(`${API_URL}/api/v1/auth`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch current user");
  }

  return data;
}

export async function login(loginRequest: LoginRequest): Promise<AppUser> {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(loginRequest)
  });

  const data = await response.json();
  console.log(data);

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

export async function register(registerRequest: RegisterRequest): Promise<AppUser> {
  const response = await fetch(`${API_URL}/api/v1/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(registerRequest)
  })

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Logout failed");
  }
}