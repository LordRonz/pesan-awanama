import { HiX } from 'react-icons/hi';

import clsxm from '@/lib/clsxm';

const DeleteButton = ({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'button'>) => {
  return (
    <button
      type='button'
      className={clsxm(
        'absolute top-0 right-0 rounded-full p-1 ring-primary-400 transition hover:bg-primary-300 focus:outline-none focus-visible:ring hidden group-hover:block',
        className
      )}
      {...rest}
    >
      {children}
      <HiX />
    </button>
  );
};

export default DeleteButton;
