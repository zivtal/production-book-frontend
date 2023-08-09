const RTL: Record<string, boolean> = {
  ar: true,
  fa: true,
  he: true,
};

export const isRtl = (languageCode: string | null = document.documentElement.getAttribute('lang')): boolean => !!languageCode && RTL[languageCode];
