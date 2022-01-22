import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import { ReactNode } from 'react';

import Accent from '@/components/Accent';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';
import { getMessages } from '@/lib/fauna';
import type { UserSession } from '@/pages/api/login';
import type { Message } from '@/types/fauna';

type OwnerPageProp = {
  user: UserSession;
  messages: Message[];
  children?: ReactNode;
};

const Owner: NextPage<OwnerPageProp> = ({ user, messages }) => {
  console.log(messages);
  return (
    <>
      <Seo templateTitle='Me lord' />
      <main>
        <section className='bg-black text-primary-50'>
          <div className='layout flex flex-col justify-center items-center min-h-screen text-center gap-y-40'>
            <div className='flex flex-col gap-y-4'>
              <h1 className='text-primary-100'>
                Welcome, <Accent>{user.name}</Accent>
              </h1>
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
};

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const user = req.session.user;

    if (!user || user?.admin !== true) {
      return {
        notFound: true,
      };
    }

    const data = await getMessages();
    console.log(data);

    return {
      props: {
        user: req.session.user,
        messages: data,
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
