// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import httpStatus from 'http-status';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createMessage } from '@/lib/fauna';
import { ErrorResponse } from '@/types/api';
import { Message } from '@/types/fauna';

type ReqBody = {
  message: string;
  captcha: string;
};

const submit = async (
  req: NextApiRequest,
  res: NextApiResponse<Message | ErrorResponse | undefined>
) => {
  const { message, captcha }: ReqBody = req.body;
  const { method } = req;
  switch (method) {
    case 'POST': {
      if (!message || message.length > 169) {
        res.status(httpStatus.BAD_REQUEST).json({
          status: httpStatus.BAD_REQUEST,
          message:
            'The message must have at least 1 characters, and no longer than 169 characters',
        });
        return;
      }
      const verifyResponse = await axios.post(
        'https://hcaptcha.com/siteverify',
        `response=${captcha}&secret=${
          process.env.HCAPTCHA_SECRET_KEY as string
        }`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          },
        }
      );
      if (verifyResponse.data.success) {
        req.body.message = message.trim();
        const result = await createMessage(req.body);
        return res.status(httpStatus.OK).json(result);
      }
      res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        status: httpStatus.UNPROCESSABLE_ENTITY,
        message: 'Unproccesable request, Invalid captcha',
      });
      break;
    }
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default submit;
