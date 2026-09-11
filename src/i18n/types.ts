export type Language =
  | 'en'
  | 'te'
  | 'hi'
  | 'ta'
  | 'kn'
  | 'ml'
  | 'bn'
  | 'mr'
  | 'es'
  | 'fr'
  | 'de'
  | 'ja';

export interface LanguageOption {
  code: Language;
  label: string; // Native script
  englishName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', englishName: 'English' },
  { code: 'te', label: 'తెలుగు', englishName: 'Telugu' },
  { code: 'hi', label: 'हिन्दी', englishName: 'Hindi' },
  { code: 'ta', label: 'தமிழ்', englishName: 'Tamil' },
  { code: 'kn', label: 'ಕನ್ನಡ', englishName: 'Kannada' },
  { code: 'ml', label: 'മലയാളം', englishName: 'Malayalam' },
  { code: 'bn', label: 'বাংলা', englishName: 'Bengali' },
  { code: 'mr', label: 'मराठी', englishName: 'Marathi' },
  { code: 'es', label: 'Español', englishName: 'Spanish' },
  { code: 'fr', label: 'Français', englishName: 'French' },
  { code: 'de', label: 'Deutsch', englishName: 'German' },
  { code: 'ja', label: '日本語', englishName: 'Japanese' },
];

export interface TranslationDictionary {
  [key: string]: string;
}
