export const themes = {
  neutral: "bg-stone-950/40 hover:bg-stone-500/10 text-stone-200 hover:text-stone-300 active:shadow-[0_2px_60px_#0c0a0944]",
  primary: "bg-neutral-900/40 hover:bg-neutral-500/10 text-cyan-500 text-cyan-700 hover:text-cyan-500 active:shadow-[0_2px_60px_#00b8db44]",
  secondary: "bg-neutral-900/40 hover:bg-neutral-500/10 text-blue-500 text-blue-700 hover:text-blue-500 active:shadow-[0_2px_60px_#155dfc44]",
  danger: "bg-red-900/10 hover:bg-red-500/10 text-red-700 hover:text-red-500 active:shadow-[0_2px_60px_#fb2c3644]",
  success: "bg-green-900/10 hover:bg-green-500/10 text-green-700 hover:text-green-500 active:shadow-[0_2px_60px_#00823644]",
  warning: "bg-yellow-900/10 hover:bg-yellow-500/10 text-yellow-700 hover:text-yellow-500 active:shadow-[0_2px_60px_#efb10044]",
} as const;
export const invertedThemes = {
  neutral: "bg-stone-200/90 hover:bg-stone-300 text-stone-900 active:shadow-[0_2px_60px_#bcb8b144]",
  primary: "bg-cyan-500/90 hover:bg-cyan-600 text-neutral-900 active:shadow-[0_2px_60px_#00b8db44]",
  secondary: "bg-blue-500/90 hover:bg-blue-600 text-neutral-900 active:shadow-[0_2px_60px_#155dfc44]",
  danger: "bg-red-500/90 hover:bg-red-600 text-white active:shadow-[0_2px_60px_#fb2c3644]",
  success: "bg-green-500/90 hover:bg-green-600 text-white active:shadow-[0_2px_60px_#00823644]",
  warning: "bg-yellow-500/90 hover:bg-yellow-600 text-neutral-900 active:shadow-[0_2px_60px_#efb10044]",
} as const;
export const themesSwitcher = {
  neutral: "bg-stone-950/40 hover:bg-stone-500/10 text-stone-200 hover:text-stone-300 active:shadow-[0_2px_60px_#0c0a0944]",
  primary: "bg-neutral-900/40 hover:bg-neutral-500/10 text-cyan-500 text-cyan-700 hover:text-cyan-500 active:shadow-[0_2px_60px_#00b8db44]",
  secondary: "bg-neutral-900/40 hover:bg-neutral-500/10 text-blue-500 text-blue-700 hover:text-blue-500 active:shadow-[0_2px_60px_#155dfc44]",
  danger: "bg-red-900/10 hover:bg-red-500/10 text-red-700 hover:text-red-500 active:shadow-[0_2px_60px_#fb2c3644]",
  success: "bg-green-900/10 hover:bg-green-500/10 text-green-700 hover:text-green-500 active:shadow-[0_2px_60px_#00823644]",
  warning: "bg-yellow-900/10 hover:bg-yellow-500/10 text-yellow-700 hover:text-yellow-500 active:shadow-[0_2px_60px_#efb10044]",
} as const;

// Nuevos temas para el input
export const inputThemes = {
  primary: 'focus-within:ring-cyan-500 focus:ring-cyan-500/40',
  secondary: 'focus-within:ring-blue-500 focus:ring-blue-500/40',
  danger: 'focus-within:ring-red-500 focus:ring-red-500/40',
  success: 'focus-within:ring-green-500 focus:ring-green-500/40',
  warning: 'focus-within:ring-yellow-500 focus:ring-yellow-500/40',
};

// Tipos para los temas
export type ThemeSwitcher = keyof typeof themesSwitcher;
export type InputTheme = keyof typeof inputThemes;
export type Theme = keyof typeof themes;
export type ThemeInverted = keyof typeof invertedThemes;