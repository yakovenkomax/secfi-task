import classNames from 'classnames';
import { ReactNode } from 'react';

type CardProps = {
  children?: ReactNode;
  className?: string;
};

export const Card = (props: CardProps) => {
  const { children, className } = props;

  return (
    <div className={classNames(className, 'p-4 md:p-8 max-w-xl mx-auto bg-white rounded-xl shadow-lg')}>{children}</div>
  );
};
