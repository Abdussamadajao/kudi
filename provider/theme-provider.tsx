import { colors, ColorScheme, ThemePalette } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useColorScheme } from "react-native";

interface ThemeContextType {
  mode: ColorScheme;
  colors: ThemePalette;
  toggleTheme: () => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "APP_THEME";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = (useColorScheme() as ColorScheme) ?? "light";
  const [mode, setMode] = useState<ColorScheme>(systemScheme);
  const [isLoading, setIsLoading] = useState(true);
  const prevSystemRef = useRef<ColorScheme | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === "light" || saved === "dark") {
          setMode(saved);
        }
      } catch (e) {
        console.warn("Failed to load theme:", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (prevSystemRef.current === null) {
      prevSystemRef.current = systemScheme;
      return;
    }
    if (prevSystemRef.current !== systemScheme) {
      prevSystemRef.current = systemScheme;
      setMode(systemScheme);
      AsyncStorage.setItem(STORAGE_KEY, systemScheme).catch(() => {});
    }
  }, [systemScheme, isLoading]);

  const toggleTheme = useCallback(async () => {
    const next: ColorScheme = mode === "light" ? "dark" : "light";
    setMode(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, next);
    } catch (e) {
      console.warn("Failed to save theme:", e);
    }
  }, [mode]);

  // Don't render children until theme is loaded to prevent flash of wrong theme
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ mode, colors: colors[mode], toggleTheme, isLoading }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
