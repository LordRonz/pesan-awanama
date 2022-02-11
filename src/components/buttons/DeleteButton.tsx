import clsx from 'clsx';
import { HiX } from 'react-icons/hi';

const DeleteButton = ({
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'button'>) => {
  return (
    <button
      type='button'
      className={clsx(
        className,
        'absolute top-0 right-0 rounded-full p-1 ring-primary-400 transition hover:bg-primary-300 focus:outline-none focus-visible:ring hidden group-hover:block'
      )}
      {...rest}
    >
      {children}
      <HiX />
    </button>
  );
};

export default DeleteButton;
