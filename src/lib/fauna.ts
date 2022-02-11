import faunadb, { query as q } from 'faunadb';

import type {
  AllMessagesRes,
  Message,
  MessageRes,
  User,
  UserRes,
} from '@/types/fauna';

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNA_SECRET as string,
  domain: 'db.us.fauna.com',
});

export const createMessage = async (body: Message) => {
  const data = await faunaClient.query<MessageRes>(
    q.Create(q.Collection('messages'), { data: body })
  );

  return data;
};

export const getMessages = async () => {
  const { data } = await faunaClient.query<AllMessagesRes>(
    q.Map(
      q.Paginate(q.Documents(q.Collection('messages'))),
      q.Lambda((x) => q.Get(x))
    )
  );

  return data.map((x) => x.data);
};

export const deleteMessage = async (ref: string) => {
  const data = await faunaClient.query<MessageRes>(
    q.Delete(q.Ref(q.Collection('messages'), ref))
  );
  return data;
};

export const getUser = async (body: User) => {
  const { name } = body;
  const data: UserRes | null = await faunaClient.query<UserRes | null>(
    q.Let(
      {
        userRef: q.Match(q.Index('get_user_by_name'), name),
        userExists: q.Exists(q.Var('userRef')),
      },
      q.If(q.Var('userExists'), q.Get(q.Var('userRef')), null)
    )
  );

  return data;
};
