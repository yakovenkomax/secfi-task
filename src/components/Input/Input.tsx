import { ChangeEvent, ChangeEventHandler, HTMLInputTypeAttribute } from 'react';

type InputProps = {
  type?: HTMLInputTypeAttribute;
  value?: string | number;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export const Input = (props: InputProps) => {
  const { type, value, placeholder, onChange } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (type === 'number' && event.target.value !== '' && isNaN(event.target.valueAsNumber)) {
      return;
    }

    if (onChange) {
      onChange(event);
    }
  };

  return <input className="input" type={type} value={value} placeholder={placeholder} onChange={handleChange} />;
};
