// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import { createMessage } from '@/lib/fauna';
import { Message } from '@/types/fauna';

const submit = async (
  req: NextApiRequest,
  res: NextApiResponse<Message | undefined>
) => {
  const result = await createMessage(req.body);
  res.status(200).json(result);
};

export default submit;
