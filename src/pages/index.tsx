/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import type { NextPage } from 'next';
import React from 'react';

import Button from '@/components/buttons/Button';
import Seo from '@/components/Seo';

const Home: NextPage = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await axios.post('/api/submit', {
      message: e.currentTarget.value,
    });
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
      <style jsx>{`
        textarea {
          resize: none;
        }
      `}</style>
    </>
  );
};

export default Home;
