import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';

import Accent from '@/components/Accent';
import Button from '@/components/buttons/Button';
import MessageCard from '@/components/contents/MessageCard';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';
import { getMessages } from '@/lib/fauna';
import type { UserSession } from '@/pages/api/login';
import type { Message } from '@/types/fauna';

const toastStyle = { background: '#333', color: '#eee' };

type OwnerPageProp = {
  user: UserSession;
  messages: Message[];
  children?: React.ReactNode;
};

const Owner: NextPage<OwnerPageProp> = ({ user, messages }) => {
  const router = useRouter();

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    toast.promise(axios.post('/api/logout', {}), {
      loading: 'Loading...',
      success: () => {
        setTimeout(() => router.push('/login'), 2000);
        return 'Logged out !, sayonara!';
      },
      error: (e) => {
        if (axios.isAxiosError(e)) {
          return e.response?.data.message ?? e.message;
        }
        return 'Logout failed, yo wtf is wrong';
      },
    });
  };

  return (
    <>
      <Seo templateTitle='Me lord' />
      <main>
        <section className='bg-black text-primary-50'>
          <div className='layout flex flex-col justify-center items-center min-h-screen text-center gap-y-20'>
            <div className='flex mt-4 justify-evenly gap-4 w-full flex-wrap'>
              <h1 className='text-primary-100'>
                Welcome, <Accent>{user.name}</Accent>
              </h1>
              <Button onClick={handleLogout}>Logout</Button>
            </div>
            <div className='flex gap-4 grow-0 shrink flex-wrap items-center justify-evenly'>
              {messages.map(({ message }, i) => (
                <MessageCard key={i}>{message}</MessageCard>
              ))}
            </div>
            <p className='text-xl text-primary-200 mb-4'>
              <ArrowLink href='/' openNewTab={false} direction='left'>
                Back To Home
              </ArrowLink>
            </p>
          </div>
        </section>
      </main>
      <Toaster
        toastOptions={{
          style: toastStyle,
          loading: {
            iconTheme: {
              primary: '#eb2754',
              secondary: 'black',
            },
          },
        }}
      />
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
