import axios from 'axios';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import Button from '@/components/buttons/Button';
import Seo from '@/components/Seo';

const toastStyle = {
  style: { background: '#333', color: '#eee' },
};

const Home: NextPage = () => {
  const [msg, setMsg] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setMsg(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '/api/submit',
        {
          message: msg,
        },
        {
          validateStatus: (status) => status !== 500,
        }
      );
      if (res.status === 200) {
        toast.success('Message sent !', toastStyle);
      } else {
        toast.error(res.data.message, toastStyle);
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        return toast.error(e.message, toastStyle);
      }
      toast.error('Failed to send message', toastStyle);
    }
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
      <Toaster />
      <style jsx>{`
        textarea {
          resize: none;
        }
      `}</style>
    </>
  );
};

export default Home;
