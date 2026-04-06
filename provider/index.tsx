import { ErrorBoundary } from "@/ui/feedback/error-boundary";
import { queryClient } from "@/lib";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SnackbarProvider } from "./snackbar";
import { useTheme } from "./theme-provider";

const Provider = () => {
  const { mode } = useTheme();
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <BottomSheetModalProvider>
          <ErrorBoundary>
            <Stack screenOptions={{ headerShown: false }} />
          </ErrorBoundary>
          <StatusBar style={mode === "dark" ? "light" : "dark"} />
        </BottomSheetModalProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
};

export default Provider;
