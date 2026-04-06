import { type TransactionCategoryId } from "@/features/transactions/transactions-filter-modal";
import { MaterialIcons } from "@expo/vector-icons";

export const TABS = ["All", "Income", "Expense"] as const;
export type TabType = (typeof TABS)[number];

export type UiTransaction = {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  isIncome: boolean;
  categoryId: TransactionCategoryId;
  recordedAt: Date;
  createdAt: Date;
  icon: keyof typeof MaterialIcons.glyphMap;
  iconBg: string;
  time: string;
};

export type FilterCategory = {
  id: TransactionCategoryId;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
};

export type TransactionSection = {
  label: string;
  data: UiTransaction[];
};
