import { axiosInstance } from "@/lib/axios";
import { authClient } from "@/lib/auth-client";
import { useSnackbar } from "@/provider/snackbar";
import type {
  AnyTransaction,
  CreateTransactionBody,
  IncomeSummary,
  TransactionFilters,
  TransactionListResponse,
  UpdateTransactionBody,
} from "@/types";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";

// ─── Query keys ───────────────────────────────────────────────────────────

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (f: TransactionFilters) => [...transactionKeys.lists(), f] as const,
  details: () => [...transactionKeys.all, "detail"] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
  summaries: () => [...transactionKeys.all, "summary"] as const,
  summary: (id: string) => [...transactionKeys.summaries(), id] as const,
};

// ─── Build query string ───────────────────────────────────────────────────

function buildParams(filters: TransactionFilters): string {
  const p = new URLSearchParams();
  if (filters.type) p.set("type", filters.type);
  if (filters.from) p.set("from", filters.from);
  if (filters.to) p.set("to", filters.to);
  if (filters.categoryIds) p.set("categoryIds", filters.categoryIds);
  if (filters.amountMin) p.set("amountMin", String(filters.amountMin));
  if (filters.amountMax) p.set("amountMax", String(filters.amountMax));
  if (filters.income_id) p.set("income_id", filters.income_id);
  if (filters.q) p.set("q", filters.q);
  if (filters.page) p.set("page", String(filters.page));
  if (filters.pageSize) p.set("pageSize", String(filters.pageSize));
  return p.toString();
}

// ─── List transactions ────────────────────────────────────────────────────

export function useTransactions(
  filters: TransactionFilters = {},
  options?: Omit<
    UseQueryOptions<TransactionListResponse>,
    "queryKey" | "queryFn"
  >,
) {
  const hasToken = !!authClient.getCookie();
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: async () => {
      const res = await axiosInstance.get<TransactionListResponse>(
        `/api/transactions?${buildParams(filters)}`,
      );
      return res.data;
    },
    staleTime: 1000 * 30,
    ...options,
    enabled: hasToken && (options?.enabled ?? true),
  });
}

// ─── Income transactions only ─────────────────────────────────────────────

export function useIncomeTransactions(
  filters: Omit<TransactionFilters, "type"> = {},
) {
  return useTransactions({ ...filters, type: "INCOME" });
}

// ─── Expense transactions only ────────────────────────────────────────────

export function useExpenseTransactions(
  filters: Omit<TransactionFilters, "type"> = {},
) {
  return useTransactions({ ...filters, type: "EXPENSE" });
}

// ─── Expenses linked to a specific income ─────────────────────────────────

export function useExpensesByIncome(
  incomeId: string,
  filters: Omit<TransactionFilters, "type" | "income_id"> = {},
) {
  return useTransactions(
    { ...filters, type: "EXPENSE", income_id: incomeId },
    { enabled: !!incomeId },
  );
}

// ─── Single transaction ───────────────────────────────────────────────────

export function useTransaction(id: string) {
  const hasToken = !!authClient.getCookie();
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: AnyTransaction }>(
        `/api/transactions/${id}`,
      );
      return res.data.data;
    },
    enabled: hasToken && !!id,
    staleTime: 1000 * 30,
  });
}

// ─── Income summary (with expenses + spent/remaining) ────────────────────

export function useIncomeSummary(incomeId: string, enabled = true) {
  const hasToken = !!authClient.getCookie();
  return useQuery({
    queryKey: transactionKeys.summary(incomeId),
    queryFn: async () => {
      const res = await axiosInstance.get<{ data: IncomeSummary }>(
        `/api/transactions/income/${incomeId}/summary`,
      );
      return res.data.data;
    },
    enabled: hasToken && !!incomeId && enabled,
    staleTime: 1000 * 30,
  });
}

// ─── Create transaction ───────────────────────────────────────────────────

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (body: CreateTransactionBody) => {
      if (!authClient.getCookie()) throw new Error("Please sign in to continue");
      const res = await axiosInstance.post<{ data: AnyTransaction }>(
        "/api/transactions",
        body,
      );
      return res.data.data;
    },

    onSuccess: (data) => {
      // invalidate all lists
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });

      // if expense tied to income — invalidate that income's summary + detail
      if (data.type === "EXPENSE" && data.income_id) {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.summary(data.income_id),
        });
        queryClient.invalidateQueries({
          queryKey: transactionKeys.detail(data.income_id),
        });
        snackbar({ message: "Expense created successfully", type: "success" });
      }
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to create expense";
      snackbar({ message: errorMessage, type: "error" });
    },
  });
}

// ─── Update transaction ───────────────────────────────────────────────────

export function useUpdateTransaction(id: string) {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();
  return useMutation({
    mutationFn: async (body: UpdateTransactionBody) => {
      if (!authClient.getCookie()) throw new Error("Please sign in to continue");
      const res = await axiosInstance.patch<{ data: AnyTransaction }>(
        `/api/transactions/${id}`,
        body,
      );
      return res.data.data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(id) });

      // re-fetch summary if income amount or expenses changed
      if (data.type === "INCOME") {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.summary(id),
        });
      }

      // if expense — re-fetch linked income summary
      if (data.type === "EXPENSE" && data.income_id) {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.summary(data.income_id),
        });
        queryClient.invalidateQueries({
          queryKey: transactionKeys.detail(data.income_id),
        });
      }
      snackbar({
        message: "Transaction updated successfully",
        type: "success",
      });
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to update transaction";
      snackbar({ message: errorMessage, type: "error" });
    },
  });
}

// ─── Delete transaction ───────────────────────────────────────────────────

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { snackbar } = useSnackbar();
  return useMutation({
    mutationFn: async ({
      id,
      incomeId,
    }: {
      id: string;
      incomeId?: string; // pass income_id if deleting an expense
    }) => {
      if (!authClient.getCookie()) throw new Error("Please sign in to continue");
      await axiosInstance.delete(`/api/transactions/${id}`);
      return { id, incomeId };
    },

    onSuccess: ({ id, incomeId }) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.removeQueries({ queryKey: transactionKeys.detail(id) });

      // if expense — update linked income summary
      if (incomeId) {
        queryClient.invalidateQueries({
          queryKey: transactionKeys.summary(incomeId),
        });
        queryClient.invalidateQueries({
          queryKey: transactionKeys.detail(incomeId),
        });
      }
      snackbar({
        message: "Transaction deleted successfully",
        type: "success",
      });
    },
    onError: (error) => {
      const errorMessage = error.message || "Failed to delete transaction";
      snackbar({ message: errorMessage, type: "error" });
    },
  });
}
