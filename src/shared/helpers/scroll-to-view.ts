export const scrollToView = (selector: string, options?: ScrollIntoViewOptions): void => {
  document.querySelector(selector)?.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'center', ...(options || {}) });
};
