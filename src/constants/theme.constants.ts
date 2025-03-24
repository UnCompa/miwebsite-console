export const themes = {
  primary: "bg-neutral-900/40 hover:bg-neutral-500/10 text-cyan-500 text-cyan-700 hover:text-cyan-500 active:shadow-[0_2px_60px_#00b8db44]",
  secondary: "bg-neutral-900/40 hover:bg-neutral-500/10 text-blue-500 text-blue-700 hover:text-blue-500 active:shadow-[0_2px_60px_#155dfc44]",
  danger: "bg-red-900/10 hover:bg-red-500/10 text-red-700 hover:text-red-500 active:shadow-[0_2px_60px_#fb2c3644]",
  success: "bg-green-900/10 hover:bg-green-500/10 text-green-700 hover:text-green-500 active:shadow-[0_2px_60px_#00823644]",
  warning: "bg-yellow-900/10 hover:bg-yellow-500/10 text-yellow-700 hover:text-yellow-500 active:shadow-[0_2px_60px_#efb10044]",
} as const;

// Tipos para los temas
export type Theme = keyof typeof themes;