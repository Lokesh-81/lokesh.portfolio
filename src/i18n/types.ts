export type Language = 'en' | 'te' | 'hi';

export interface LanguageOption {
  code: Language;
  label: string; // Native name
  englishName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', englishName: 'English' },
  { code: 'te', label: 'తెలుగు', englishName: 'Telugu' },
  { code: 'hi', label: 'हिन्दी', englishName: 'Hindi' },
];

export interface TranslationDictionary {
  [key: string]: string;
}
