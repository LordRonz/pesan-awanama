import faunadb, { query as q } from 'faunadb';

import { Message, User, UserRes } from '@/types/fauna';

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNA_SECRET as string,
  domain: 'db.us.fauna.com',
});

export const createMessage = async (body: Message) => {
  const data = await faunaClient.query<Message>(
    q.Create(q.Collection('messages'), { data: body })
  );

  return data;
};

export const getUser = async (body: User) => {
  const { name, password } = body;
  const data = await faunaClient.query<UserRes>(
    q.Get(
      q.Intersection(
        q.Match(q.Index('get_user_by_name'), name),
        q.Match(q.Index('get_user_by_password'), password)
      )
    )
  );

  return data;
};
