import { useStyles } from "@/hooks/useStyles";
import { useTheme } from "@/provider/theme-provider";
import { MaterialIcons } from "@expo/vector-icons";
import React, { Component, type ReactNode } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { createErrorBoundaryStyles } from "./error-boundary-styles";

export type ErrorType =
  | "network"
  | "not_found"
  | "unauthorized"
  | "forbidden"
  | "server"
  | "empty"
  | "unknown";

interface ErrorConfig {
  icon: string;
  title: string;
  message: string;
}

const ERROR_CONFIG: Record<ErrorType, ErrorConfig> = {
  network: {
    icon: "wifi-off",
    title: "No connection",
    message: "Check your internet connection and try again.",
  },
  not_found: {
    icon: "search-off",
    title: "Not found",
    message: "The item you're looking for doesn't exist or has been removed.",
  },
  unauthorized: {
    icon: "lock",
    title: "Session expired",
    message: "Please sign in again to continue.",
  },
  forbidden: {
    icon: "block",
    title: "Access denied",
    message: "You don't have permission to view this.",
  },
  server: {
    icon: "cloud-off",
    title: "Server error",
    message: "Something went wrong on our end. Please try again later.",
  },
  empty: {
    icon: "inbox",
    title: "Nothing here",
    message: "No items to show right now.",
  },
  unknown: {
    icon: "error-outline",
    title: "Something went wrong",
    message: "An unexpected error occurred. Please try again.",
  },
};

export function resolveErrorType(error: unknown): ErrorType {
  if (!error) return "unknown";

  const status = (error as { response?: { status?: number } })?.response
    ?.status;
  if (status) {
    if (status === 401) return "unauthorized";
    if (status === 403) return "forbidden";
    if (status === 404) return "not_found";
    if (status >= 500) return "server";
  }

  const message =
    (error as { message?: string })?.message?.toLowerCase() ?? "";
  if (
    message.includes("network") ||
    message.includes("connection") ||
    message.includes("timeout") ||
    message.includes("fetch")
  ) {
    return "network";
  }

  return "unknown";
}

interface ErrorViewProps {
  type?: ErrorType;
  error?: unknown;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

export function ErrorView({
  type,
  error,
  title,
  message,
  onRetry,
  retryLabel = "Try again",
  style,
  compact = false,
}: ErrorViewProps) {
  const { colors } = useTheme();
  const styles = useStyles(createErrorBoundaryStyles);

  const resolved = type ?? resolveErrorType(error);
  const config = ERROR_CONFIG[resolved];

  const displayTitle = title ?? config.title;
  const displayMessage = message ?? config.message;

  if (compact) {
    return (
      <View style={[styles.compactContainer, style]}>
        <MaterialIcons
          name={config.icon as keyof typeof MaterialIcons.glyphMap}
          size={18}
          color={colors.textSecondary}
        />
        <Text style={styles.compactText}>{displayTitle}</Text>
        {onRetry ? (
          <TouchableOpacity onPress={onRetry}>
            <Text style={styles.compactRetry}>{retryLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconWrap}>
        <MaterialIcons
          name={config.icon as keyof typeof MaterialIcons.glyphMap}
          size={40}
          color={colors.textSecondary}
        />
      </View>

      <Text style={styles.title}>{displayTitle}</Text>

      <Text style={styles.message}>{displayMessage}</Text>

      {onRetry ? (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <MaterialIcons name="refresh" size={18} color={colors.onPrimary} />
          <Text style={styles.retryText}>{retryLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

interface QueryStateProps<T> {
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  data?: T;
  isEmpty?: (data: T) => boolean;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
  children: (data: T) => ReactNode;
  loadingComponent?: ReactNode;
  emptyTitle?: string;
  emptyMessage?: string;
}

export function QueryState<T>({
  isLoading,
  isError,
  error,
  data,
  isEmpty,
  onRetry,
  style,
  children,
  loadingComponent,
  emptyTitle,
  emptyMessage,
}: QueryStateProps<T>) {
  const { colors } = useTheme();
  const styles = useStyles(createErrorBoundaryStyles);

  if (isLoading) {
    return loadingComponent ? (
      <>{loadingComponent}</>
    ) : (
      <View style={[styles.center, style]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return <ErrorView error={error} onRetry={onRetry} style={style} />;
  }

  if (!data || (isEmpty && isEmpty(data))) {
    return (
      <ErrorView
        type="empty"
        title={emptyTitle}
        message={emptyMessage}
        style={style}
      />
    );
  }

  return <>{children(data)}</>;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function ErrorBoundaryDefaultFallback({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  const styles = useStyles(createErrorBoundaryStyles);
  return (
    <ScrollView contentContainerStyle={styles.boundaryContainer}>
      <ErrorView
        type="unknown"
        message={error?.message}
        onRetry={onRetry}
        retryLabel="Try again"
      />
    </ScrollView>
  );
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <ErrorBoundaryDefaultFallback
          error={this.state.error}
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

interface FieldErrorProps {
  message?: string;
  style?: StyleProp<ViewStyle>;
}

export function FieldError({ message, style }: FieldErrorProps) {
  const { colors } = useTheme();
  const styles = useStyles(createErrorBoundaryStyles);
  if (!message) return null;

  return (
    <View style={[styles.fieldError, style]}>
      <MaterialIcons name="error-outline" size={13} color={colors.danger} />
      <Text style={styles.fieldErrorText}>{message}</Text>
    </View>
  );
}

interface InlineAlertProps {
  message: string;
  type?: "error" | "warning" | "info" | "success";
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
}

const ALERT_ICONS = {
  error: "error-outline" as const,
  warning: "warning-amber" as const,
  info: "info-outline" as const,
  success: "check-circle-outline" as const,
};

export function InlineAlert({
  message,
  type = "error",
  onClose,
  style,
}: InlineAlertProps) {
  const styles = useStyles(createErrorBoundaryStyles);
  const fgStyle =
    type === "error"
      ? styles.alertFgError
      : type === "warning"
        ? styles.alertFgWarning
        : type === "info"
          ? styles.alertFgInfo
          : styles.alertFgSuccess;
  const bgStyle =
    type === "error"
      ? styles.alertError
      : type === "warning"
        ? styles.alertWarning
        : type === "info"
          ? styles.alertInfo
          : styles.alertSuccess;

  return (
    <View style={[styles.alert, bgStyle, style]}>
      <MaterialIcons name={ALERT_ICONS[type]} size={18} color={fgStyle.color} />
      <Text style={[styles.alertText, fgStyle]}>{message}</Text>
      {onClose ? (
        <TouchableOpacity onPress={onClose} style={styles.alertClose}>
          <MaterialIcons name="close" size={16} color={fgStyle.color} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
