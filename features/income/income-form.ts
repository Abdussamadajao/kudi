import * as Yup from "yup";

export type IncomeFormValues = {
  amount: string;
  sourceName: string;
  categoryId: string;
  tag: "Monthly" | "Bonus" | "One-time";
  date: Date;
  notes: string;
};

export const TAG_TABS = ["Monthly", "Bonus", "One-time"] as const;

export const incomeFormSchema = Yup.object({
  amount: Yup.string()
    .required("Enter an amount")
    .test("positive", "Enter a valid amount", (v) => {
      const n = parseFloat((v ?? "").replace(/,/g, ""));
      return !Number.isNaN(n) && n > 0;
    }),
  sourceName: Yup.string(),
  categoryId: Yup.string().required("Select a category"),
  tag: Yup.mixed<IncomeFormValues["tag"]>()
    .oneOf([...TAG_TABS])
    .required(),
  date: Yup.date().required(),
  notes: Yup.string(),
});

export function formatIncomeAmountPreview(raw: string): string {
  const n = parseFloat((raw ?? "").replace(/,/g, ""));
  if (!raw || Number.isNaN(n)) return "₦0";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}
