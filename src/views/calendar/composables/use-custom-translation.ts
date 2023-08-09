export default (path: string, translator: (value: string) => string): ((value: string) => string) =>
  (value: string, subPath?: string) =>
    translator(`${path}.${subPath ? `${subPath}.` : ''}${value}`);
