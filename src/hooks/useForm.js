import PropTypes from 'prop-types';
import { useState } from 'react';

export function useForm(inputValues = {}) {
  useForm.propTypes = {
    inputValues: PropTypes.object,
  };

  const [values, setValues] = useState(inputValues);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  };

  return { values, handleChange, setValues };
}
