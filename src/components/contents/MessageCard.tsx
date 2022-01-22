import clsx from 'clsx';

export type MessageCardProp = React.ComponentPropsWithoutRef<'div'>;

const MessageCard = ({ children, className }: MessageCardProp) => {
  return <div className={clsx('p-2', className)}>{children}</div>;
};

export default MessageCard;
