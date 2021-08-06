export const roll = async () => {
  const res = await fetch("/api/roll");
  const data: { creditsLeft: number; results: number[]; didWin: boolean } =
    await res.json();

  return data;
};

export const cashOut = async () => {
  const res = await fetch("/api/cash-out");
  const data: { creditsLeft: number; results: number[]; didWin: boolean } =
    await res.json();

  return data;
};
