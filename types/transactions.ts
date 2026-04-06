import type { Category, CategoryType } from "./categories";

export type TransactionType = "INCOME" | "EXPENSE";
export type TransactionTag = "Monthly" | "Bonus" | "One-time";

// ─── Category snapshot ────────────────────────────────────────────────────

export type CategorySnapshot = Pick<
  Category,
  "id" | "name" | "icon" | "color" | "type"
> & {
  type: CategoryType;
};

// ─── Summary (attached to INCOME transactions) ────────────────────────────

export interface TransactionSummary {
  total: number;
  spent: number;
  remaining: number;
  percentage: number;
}

// ─── Base transaction ─────────────────────────────────────────────────────

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: string; // Decimal serialized as string from Prisma
  category_id: string;
  category: CategorySnapshot;
  user_id: string;
  income_id: string | null;
  source_name: string | null;
  notes: string | null;
  receipt_url: string | null;
  tag: TransactionTag | null;
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

// ─── Expense snapshot (nested inside income) ──────────────────────────────

export interface ExpenseSnapshot {
  id: string;
  amount: string;
  source_name: string | null;
  notes: string | null;
  tag: TransactionTag | null;
  recorded_at: string;
  created_at: string;
  category: CategorySnapshot;
}

// ─── Income snapshot (nested inside expense) ──────────────────────────────

export interface IncomeSnapshot {
  id: string;
  amount: string;
  source_name: string | null;
  notes: string | null;
  tag: TransactionTag | null;
  recorded_at: string;
  created_at: string;
  category: CategorySnapshot;
}

// ─── Income transaction (with expenses + summary) ─────────────────────────

export interface IncomeTransaction extends Transaction {
  type: "INCOME";
  income: null;
  expenses: ExpenseSnapshot[];
  summary: TransactionSummary;
}

// ─── Expense transaction (with linked income) ─────────────────────────────

export interface ExpenseTransaction extends Transaction {
  type: "EXPENSE";
  income: IncomeSnapshot | null;
  expenses: [];
}

// ─── Union — what the API returns ─────────────────────────────────────────

export type AnyTransaction = IncomeTransaction | ExpenseTransaction;

// ─── Full income summary (from /income/:id/summary) ───────────────────────

export interface IncomeSummary extends IncomeTransaction {
  expenses: (ExpenseSnapshot & {
    category: CategorySnapshot;
  })[];
}

// ─── List response ────────────────────────────────────────────────────────

export interface TransactionListResponse {
  data: AnyTransaction[];
  meta: TransactionMeta;
}

export interface TransactionMeta {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

// ─── Request bodies ───────────────────────────────────────────────────────

export interface CreateIncomeBody {
  type: "INCOME";
  amount: number;
  category_id: string;
  source_name?: string;
  notes?: string;
  tag?: TransactionTag;
  recorded_at: string;
}

export interface CreateExpenseBody {
  type: "EXPENSE";
  amount: number;
  category_id: string;
  income_id?: string;
  source_name?: string;
  notes?: string;
  receipt_url?: string;
  tag?: TransactionTag;
  recorded_at: string;
}

export type CreateTransactionBody = CreateIncomeBody | CreateExpenseBody;

export interface UpdateTransactionBody {
  amount?: number;
  category_id?: string;
  income_id?: string | null;
  source_name?: string;
  notes?: string;
  receipt_url?: string;
  tag?: TransactionTag | null;
  recorded_at?: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  from?: string;
  to?: string;
  categoryIds?: string;
  amountMin?: number;
  amountMax?: number;
  income_id?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

// ─── Insufficient balance error detail ───────────────────────────────────

export interface InsufficientBalanceDetail {
  total: number;
  spent: number;
  remaining: number;
  requested: number;
}

// ─── Type guards ──────────────────────────────────────────────────────────

export function isIncome(tx: AnyTransaction): tx is IncomeTransaction {
  return tx.type === "INCOME";
}

export function isExpense(tx: AnyTransaction): tx is ExpenseTransaction {
  return tx.type === "EXPENSE";
}
