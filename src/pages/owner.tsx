import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import { ReactNode } from 'react';

import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';

import type { UserSession } from './api/login';

type OwnerPageProp = {
  user: UserSession;
  children?: ReactNode;
};

const Owner: NextPage<OwnerPageProp> = ({ user }) => (
  <>
    <Seo templateTitle='Me lord' />
    <main>
      <section className='bg-black text-primary-50'>
        <div className='layout flex flex-col justify-center items-center min-h-screen text-center gap-y-40'>
          <div className='flex flex-col gap-y-4'>
            <h1 className='text-8xl text-primary-300'>404</h1>
            <h2>Welcome, {user.name}</h2>
          </div>

          <p className='text-xl text-primary-200'>
            <ArrowLink href='/' openNewTab={false} direction='left'>
              Back To Home
            </ArrowLink>
          </p>
        </div>
      </section>
    </main>
  </>
);

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const user = req.session.user;

    if (!user || user?.admin !== true) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        user: req.session.user,
      },
    };
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

export default Owner;
