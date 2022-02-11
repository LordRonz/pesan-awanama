import axios from 'axios';
import { withIronSessionSsr } from 'iron-session/next';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import toast, { Toaster } from 'react-hot-toast';
import { useQuery } from 'react-query';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Accent from '@/components/Accent';
import Button from '@/components/buttons/Button';
import DeleteButton from '@/components/buttons/DeleteButton';
import MessageCard from '@/components/contents/MessageCard';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';
import useRQWithToast from '@/hooks/toast/useRQWithToast';
import type { UserSession } from '@/pages/api/login';
import type { MessageRes } from '@/types/fauna';

const toastStyle = { background: '#333', color: '#eee' };
const MeSwal = withReactContent(Swal);

type OwnerPageProp = {
  user: UserSession;
  children?: React.ReactNode;
};

const Owner: NextPage<OwnerPageProp> = ({ user }) => {
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

  //#region  //*=========== Get Messages ===========
  const { data, refetch } = useRQWithToast(
    useQuery<{ messages: MessageRes[] }, Error>('/api/message', { retry: 1 }),
    {
      loading: 'Fetching messages...',
      success: 'Messages fetched successfully',
    }
  );
  //#endregion  //*======== Get Messages ===========

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    e.preventDefault();
    const result = await MeSwal.fire({
      title: 'Are you sure want to delete this message?',
      showCancelButton: true,
      color: '#ddd',
      confirmButtonColor: '#eb2754',
      confirmButtonText: 'Delete it!',
      background: '#111',
    });
    if (result.isConfirmed) {
      toast.promise(axios.delete(`/api/message/${id}`), {
        loading: 'Deleting...',
        success: () => {
          refetch();
          return 'Message deleted!';
        },
        error: (e) => {
          if (axios.isAxiosError(e)) {
            return e.response?.data.message ?? e.message;
          }
          return 'Delete message failed';
        },
      });
    }
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
              {data?.messages.map(({ data, id }) => (
                <MessageCard key={id}>
                  {data.message}
                  <DeleteButton onClick={(e) => handleDelete(e, id)} />
                </MessageCard>
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
