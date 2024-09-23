import { create } from 'zustand';
import { Subscription } from '@/types/subscription';

export type LanguagesSupported =
  | 'en'
  | 'de'
  | 'fr'
  | 'es'
  | 'hi'
  | 'ja'
  | 'la'
  | 'ru'
  | 'zh'
  | 'ar';

export const LanguagesSupportedMap: Record<LanguagesSupported, string> = {
  en: 'English',
  de: 'German',
  fr: 'French',
  es: 'Spanish',
  hi: 'Hindi',
  ja: 'Japanese',
  la: 'Latin',
  ru: 'Russian',
  zh: 'Mandarin',
  ar: 'Arabic',
};

interface LanguageState {
  language: LanguagesSupported;
  setLanguage: (language: LanguagesSupported) => void;
  getLanguages: (isPro: boolean) => LanguagesSupported[];
  getNotSupportedLanguages: (isPro: boolean) => LanguagesSupported[];
}

const LANGUAGES_IN_FREE = 2;

export const useLanguageStore = create<LanguageState>()((set) => ({
  language: 'en',
  setLanguage: (language: LanguagesSupported) => set({ language }),
  getLanguages: (isPro: boolean) => {
    // If user is a pro return all supported languages
    if (isPro)
      return Object.keys(LanguagesSupportedMap) as LanguagesSupported[];

    // If not pro, return only the first two languages
    return Object.keys(LanguagesSupportedMap).slice(
      0,
      LANGUAGES_IN_FREE
    ) as LanguagesSupported[];
  },
  getNotSupportedLanguages: (isPro: boolean) => {
    if (isPro) return []; // No unsupported languages for pro users

    return Object.keys(LanguagesSupportedMap).slice(
      LANGUAGES_IN_FREE
    ) as LanguagesSupported[]; // Excluding the first two supported languages
  },
}));

interface SubscriptionState {
  subscription: Subscription | null | undefined;
  setSubscription: (subscription: Subscription | null) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: undefined,
  setSubscription: (subscription: Subscription | null) => set({ subscription }),
}));
