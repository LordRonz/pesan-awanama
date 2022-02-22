// pages/api/login.ts

import { compare } from 'bcrypt';
import httpStatus from 'http-status';
import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getUser } from '@/lib/fauna';
import rateLimit from '@/lib/rateLimit';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
      name: string;
      admin?: boolean;
    };
  }
}

export type UserSession = {
  id: number;
  name: string;
  admin?: boolean;
};

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export default withIronSessionApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await limiter.check(res, 10, 'CACHE_TOKEN_LOGIN'); // 10 requests per minute
    } catch {
      res.status(429).json({ status: 429, message: 'Rate limit exceeded' });
    }

    const { method } = req;

    switch (method) {
      case 'POST': {
        const data = await getUser(req.body);

        if (!data || !(await compare(req.body.password, data.data.password))) {
          return res.status(httpStatus.BAD_REQUEST).json({
            status: httpStatus.BAD_REQUEST,
            message: 'Name or password are invalid, who tf are u',
          });
        }

        req.session.user = {
          id: data.ts,
          name: data.data.name,
          admin: data.data.admin,
        };
        await req.session.save();
        res.send({ ok: true });
        break;
      }
      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  },
  {
    cookieName: 'anjay_kue',
    password: process.env.COOKIE_PASS as string,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
);
