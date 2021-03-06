export type Message = {
  message: string;
};

export type AllMessagesRes = {
  data: MessageRes[];
};

export type AllMessagesResRaw = {
  data: MessageResRaw[];
};

export type MessageRes = {
  data: Message;
  ts: number;
  id: string;
};

export type MessageResRaw = {
  data: Message;
  ts: number;
  ref: {
    id: string;
  };
};

export type User = {
  name: string;
  password: string;
  admin?: boolean;
};

export type UserRes = {
  data: User;
  ts: number;
  ref: {
    id: string;
  };
};
