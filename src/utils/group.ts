// utils/group.ts
export interface User {
  username: string;
  name: string;
  password: string;
  photo: string;
  group?: string;
  [key: string]: string | number | boolean | undefined;
}

export function assignGroups(users: User[], groupCount: number): Record<string, User[]> {
  const shuffled = [...users].sort(() => Math.random() - 0.5);
  const result: Record<string, User[]> = {};
  for (let i = 0; i < groupCount; i++) {
    result[`조${i + 1}`] = [];
  }
  shuffled.forEach((user, i) => {
    result[`조${(i % groupCount) + 1}`].push(user);
  });
  return result;
}