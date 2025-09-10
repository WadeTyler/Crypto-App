import type {CreateTransactionRequest} from "./transaction.types.ts";

const API_URL = import.meta.env.VITE_BASE_API_URL;

export async function createTransaction({portfolioId, createRequest}: {portfolioId: number, createRequest: CreateTransactionRequest}): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/portfolios/${portfolioId}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(createRequest),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to create transaction');
  }
}