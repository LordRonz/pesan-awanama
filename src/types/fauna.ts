export type Message = {
  message: string;
};

export type MessagesRes = {
  data: {
    data: Message;
  }[];
};

export type User = {
  name: string;
  password: string;
  admin?: boolean;
};

export type UserRes = {
  data: User;
  ts: number;
};
