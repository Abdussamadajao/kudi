import { SnackbarContainer } from "@/ui/snackbar-container";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";

type SnackbarProps = {
  id: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  actionText?: string;
  onActionPress?: () => void;
  duration?: number;
  position?: "top" | "bottom" | "center";
};

interface SnackbarContextType {
  snackbar: (snackbar: Omit<SnackbarProps, "id">) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<SnackbarProps[]>([]);

  const snackbar = (snackbar: Omit<SnackbarProps, "id">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, ...snackbar }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };
  return (
    <SnackbarContext.Provider value={{ snackbar }}>
      {children}
      <View pointerEvents="box-none" style={styles.stack}>
        {toasts.map(({ id, message, actionText, duration, type, position }) => (
          <SnackbarContainer
            type={type}
            key={id}
            message={message}
            duration={duration}
            actionText={actionText}
            position={position}
            onActionPress={() => removeToast(id)}
          />
        ))}
      </View>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  stack: {
    position: "absolute",
    top: 56,
    left: 16,
    right: 16,
    gap: 12,
    zIndex: 2000,
  },
});
