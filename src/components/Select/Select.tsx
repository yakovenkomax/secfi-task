import { ChangeEventHandler } from 'react';

import ArrowSvg from './arrow.svg';

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

  return (
    <div className="relative">
      <select className="input pr-8 w-full h-full items-center" value={value} onChange={onChange}>
        {placeholder && (
          <option key="placeholder" value={EMPTY_VALUE}>
            {placeholder}
          </option>
        )}
        {items.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <ArrowSvg className="absolute right-1 top-1/2 -mt-4 w-8 h-8 fill-neutral-400 pointer-events-none" />
    </div>
  );
};
