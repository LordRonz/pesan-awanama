import faunadb, { query as q } from 'faunadb';

import { Message } from '@/types/fauna';

const faunaClient = new faunadb.Client({
  secret: process.env.FAUNA_SECRET as string,
  domain: 'db.us.fauna.com',
});

export const createMessage = async (body: Message) => {
  let data;
  try {
    data = await faunaClient.query<Message>(
      q.Create(q.Collection('messages'), { data: body })
    );
  } catch (e) {
    console.error(e);
    console.log('njir');
  }

  return data;
};
