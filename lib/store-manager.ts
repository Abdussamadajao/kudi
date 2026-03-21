import * as SecureStore from "expo-secure-store";

interface AsyncStorageAdapter {
    getItem: <T>(key: string) => Promise<T | null>;
    setItem: <T>(key: string, value: T) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
    clear: () => Promise<void>;
}

export const localStorage: AsyncStorageAdapter = {
    getItem: async <T>(key: string): Promise<T | null> => {
        const value = await SecureStore.getItemAsync(key);
        return value ? JSON.parse(value) : null;
    },
    setItem: async <T>(key: string, value: T): Promise<void> => {
        await SecureStore.setItemAsync(key, JSON.stringify(value));
    },
    removeItem: async (key: string): Promise<void> => {
        await SecureStore.deleteItemAsync(key);
    },
    clear: async (): Promise<void> => {
        await SecureStore.deleteItemAsync("*");
    },
};

export const zustandStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return SecureStore.getItemAsync(name);
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await SecureStore.setItemAsync(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await SecureStore.deleteItemAsync(name);
    },
};