import type {Portfolio} from "./portfolio.types.ts";

const API_URL = import.meta.env.VITE_BASE_API_URL;

export async function getAllPortfolios(): Promise<Portfolio[]> {
  const response = await fetch(`${API_URL}/api/v1/portfolios`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch portfolios');
  }

  return data;
}

export async function getPortfolioById(id: number | null): Promise<Portfolio | null> {
  if (id == null) {
    return null;
  }
  const response = await fetch(`${API_URL}/api/v1/portfolios/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch portfolios');
  }

  return data;
}

export async function deletePortfolioById(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/portfolios/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to delete portfolio');
  }
}

export async function createPortfolio(name: string): Promise<Portfolio> {
  const response = await fetch(`${API_URL}/api/v1/portfolios?name=${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create portfolio');
  }
  return data;
}