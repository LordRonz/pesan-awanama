// pages/api/login.ts

import { withIronSessionApiRoute } from 'iron-session/next';
import type { NextApiRequest, NextApiResponse } from 'next';

import { getUser } from '@/lib/fauna';

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

export default withIronSessionApiRoute(
  async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    // get user from database then:

    const data = await getUser(req.body);

    req.session.user = {
      id: data.ts,
      name: data.data.name,
      admin: data.data.name === 'lordronz',
    };
    await req.session.save();
    res.send({ ok: true });
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
