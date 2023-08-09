export const isToday = (value: number): boolean => {
  const now = new Date();
  const date = new Date(value);

  return now.getDate() === date.getDate() && now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear();
};
