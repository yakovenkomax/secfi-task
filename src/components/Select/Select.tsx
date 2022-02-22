import classNames from 'classnames';
import { ChangeEventHandler } from 'react';

import ArrowSvg from 'components/Select/images/arrow.svg';

export type SelectItem = {
  label: string;
  value: string;
};

export type SelectProps = {
  items: SelectItem[];
  value?: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLSelectElement>;
};

const EMPTY_VALUE = '';

export const Select = (props: SelectProps) => {
  const { items, value = EMPTY_VALUE, placeholder, onChange } = props;
  const isPlaceholderSelected = value === EMPTY_VALUE;

  return (
    <div className="relative">
      <select
        className={classNames(
          'input pr-10 w-full h-full whitespace-nowrap',
          isPlaceholderSelected && 'text-neutral-300',
        )}
        value={value}
        onChange={onChange}
      >
        {placeholder && (
          <option disabled key="placeholder" value={EMPTY_VALUE}>
            {placeholder}
          </option>
        )}
        {items.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <ArrowSvg className="absolute right-4 top-1/2 -mt-2 w-4 h-4 fill-neutral-400 pointer-events-none" />
    </div>
  );
};
