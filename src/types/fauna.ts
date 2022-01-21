export type Message = {
  message: string;
};

export type User = {
  name: string;
  password: string;
};

export type UserRes = {
  data: User;
  ts: number;
};
