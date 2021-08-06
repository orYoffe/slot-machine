const users: { [key: string]: number } = {};

export const getUserCredits = (id: string) => users[id];
export const updateUserCredits = (id: string, value: number) =>
  (users[id] = value);
export const deleteUser = (id: string) => delete users[id];
