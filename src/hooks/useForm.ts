import { useState, type ChangeEvent } from 'react';

type UseFormReturn<T> = {
  values: T;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  setValues: React.Dispatch<React.SetStateAction<T>>;
};

export function useForm<T extends Record<string, string | number | boolean>>(
  inputValues: T
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(inputValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = event.target;

    // если input type=checkbox или radio
    const newValue: string | number | boolean =
      type === 'checkbox' ? checked : type === 'number' ? Number(value) : value;

    setValues((prev) => ({ ...prev, [name]: newValue }));
  };

  return { values, handleChange, setValues };
}
