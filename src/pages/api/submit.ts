// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import httpStatus from 'http-status';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createMessage } from '@/lib/fauna';
import { ErrorResponse } from '@/types/api';
import { Message } from '@/types/fauna';

const submit = async (
  req: NextApiRequest,
  res: NextApiResponse<Message | ErrorResponse | undefined>
) => {
  const { message }: Message = req.body;
  if (!message || message.length > 169) {
    res.status(httpStatus.BAD_REQUEST).json({
      status: httpStatus.BAD_REQUEST,
      message:
        'The message must have at least 1 characters, and no longer than 169 characters',
    });
    return;
  }
  req.body.message = message.trim();
  const result = await createMessage(req.body);
  res.status(httpStatus.OK).json(result);
};

export default submit;
