import clsx from 'clsx';

export type MessageCardProp = React.ComponentPropsWithoutRef<'div'>;

const MessageCard = ({ children, className }: MessageCardProp) => {
  return (
    <div
      className={clsx(
        'group relative p-2 rounded-lg border-primary-200 border-2 md:max-w-[40%]',
        className
      )}
    >
      {children}
    </div>
  );
};

export default MessageCard;
