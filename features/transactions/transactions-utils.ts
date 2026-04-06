import { formatPrice } from "@/lib/custom";
import { MaterialIcons } from "@expo/vector-icons";
import { startOfDay, subDays } from "date-fns";

export function isValidMaterialIcon(name: string): name is keyof typeof MaterialIcons.glyphMap {
  return name in MaterialIcons.glyphMap;
}

export function getSectionLabel(date: Date): string {
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);
  const d = startOfDay(date);
  if (d.getTime() === today.getTime()) return "TODAY";
  if (d.getTime() === yesterday.getTime()) return "YESTERDAY";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAmount(amount: number, isIncome: boolean): string {
  const sign = isIncome ? "+ " : "- ";
  return sign + formatPrice(Math.abs(amount));
}

export function getToday(): Date {
  return startOfDay(new Date());
}
