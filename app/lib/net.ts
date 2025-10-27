import Constants from 'expo-constants';
const base = Constants?.expoConfig?.extra?.apiBase || process.env.EXPO_PUBLIC_API_BASE; // support both
export const API_BASE = base as string;

