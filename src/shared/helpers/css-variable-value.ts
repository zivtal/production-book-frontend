const get = (property: string): string => {
  const extract = /(^var\()(.*?)(?=\)$)/g.exec(property)?.shift();

  return getComputedStyle(document.documentElement).getPropertyValue(extract?.slice(4) || property);
};

const set = (property: string, value?: string): void => {
  if (!value) {
    document.documentElement.style.removeProperty(`--${property}`);

    return;
  }

  document.documentElement.style.setProperty(`--${property}`, value);
};

export const cssVariable = { get, set };
