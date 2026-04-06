import { expoClient } from "@better-auth/expo/client";
import {
  customSessionClient,
  emailOTPClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL!,
  plugins: [
    expoClient({
      scheme: "ini", // must match app.json "scheme"
      storagePrefix: "ini",
      storage: SecureStore,
      cookiePrefix: "ini",
    }),
    emailOTPClient(),
    customSessionClient(),
    inferAdditionalFields({
      user: {
        phone: {
          type: "string",
          required: false,
        },
        username: {
          type: "string",
          required: false,
        },
        bio: {
          type: "string",
          required: false,
        },
        avatarUrl: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
});
