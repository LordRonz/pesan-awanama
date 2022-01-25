import HCaptcha from '@hcaptcha/react-hcaptcha';
import axios from 'axios';
import type { NextPage } from 'next';
import React, { useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Button from '@/components/buttons/Button';
import Seo from '@/components/Seo';

const toastStyle = { background: '#333', color: '#eee' };

const Home: NextPage = () => {
  const [msg, setMsg] = useState<string>('');
  const captchaRef = useRef<HCaptcha>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setMsg(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    captchaRef.current?.execute();
  };

  const handleVerify = (captcha: string) => {
    if (!captcha) {
      return;
    }

    toast.promise(
      axios.post('/api/submit', {
        captcha,
        message: msg,
      }),
      {
        loading: 'Loading...',
        success: 'Message sent !',
        error: (e) => {
          if (axios.isAxiosError(e)) {
            return e.response?.data.message ?? e.message;
          }
          return 'Failed to send message';
        },
      }
    );
  };

  return (
    <>
      <Seo />
      <main>
        <section className='bg-black text-primary-50'>
          <div className='layout flex flex-col justify-center items-center min-h-screen text-center'>
            <h1 className='mb-4'>Tell me something, anon !</h1>
            <p className='mb-2'>
              No need to worry, this is completely anonymous
            </p>
            <form onSubmit={handleSubmit}>
              <HCaptcha
                id='test'
                size='invisible'
                ref={captchaRef}
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY as string}
                onVerify={handleVerify}
                theme='dark'
              />
              <textarea
                className='placeholder:text-primary-100 p-2 border-2 rounded-lg border-primary-300 bg-gray-900'
                id='msg'
                name='msg'
                rows={5}
                cols={35}
                placeholder='Type here...'
                aria-label='message'
                value={msg}
                onChange={handleChange}
                required
              />
              <div className='mt-2'>
                <Button type='submit'>Submit</Button>
              </div>
            </form>

            <footer className='absolute bottom-2'>
              © Aaron Christopher {new Date().getFullYear()}
            </footer>
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
      <style jsx>{`
        textarea {
          resize: none;
        }
      `}</style>
    </>
  );
};

export default Home;
