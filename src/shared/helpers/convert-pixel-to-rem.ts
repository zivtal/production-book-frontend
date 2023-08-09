export const convertPixelToRem = (pixel: number) => {
  return pixel / parseFloat(getComputedStyle(document.documentElement).fontSize);
};
