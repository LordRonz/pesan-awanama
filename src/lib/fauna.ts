/* eslint-disable unused-imports/no-unused-vars */
import faunadb, { query as q } from 'faunadb';

import type {
  AllMessagesResRaw,
  Message,
  MessageRes,
  MessageResRaw,
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

export const getMessages = async (): Promise<MessageRes[]> => {
  const { data } = await faunaClient.query<AllMessagesResRaw>(
    q.Map(
      q.Paginate(q.Documents(q.Collection('messages'))),
      q.Lambda((x) => q.Get(x))
    )
  );

  return data.map((datum) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { ref, ...newDatum } = datum as MessageRes & MessageResRaw;
    newDatum.id = datum.ref.id;
    return newDatum;
  });
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
