export type CategoryType = "INCOME" | "EXPENSE";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  type: CategoryType;
  is_system: boolean;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryBody {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
}

export interface UpdateCategoryBody {
  name?: string;
  icon?: string;
  color?: string;
}
