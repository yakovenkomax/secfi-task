import { ChangeEventHandler } from 'react';

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
    <select value={value} onChange={onChange}>
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
  );
};
