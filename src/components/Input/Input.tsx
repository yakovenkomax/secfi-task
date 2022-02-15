import { ChangeEvent, ChangeEventHandler, HTMLInputTypeAttribute } from 'react';

type InputProps = {
  type?: HTMLInputTypeAttribute;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const Input = (props: InputProps) => {
  const { type, value, onChange } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (type === 'number' && event.target.value !== '' && isNaN(event.target.valueAsNumber)) {
      return;
    }

    if (onChange) {
      onChange(event);
    }
  };

  return <input type={type} value={value} onChange={handleChange} />;
};
