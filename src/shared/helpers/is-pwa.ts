export const isPWA = ((): boolean => {
  const mqStandalone = '(display-mode: standalone)';

  return window.matchMedia(mqStandalone).matches;
})();
