import React, { useState, useEffect } from 'react';
import validateLogin from './validateLogin';

function useFormValidation(initialState, validate, authenticate) {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      const noErrors = Object.keys(errors).length === 0;
      if (noErrors) {
        authenticate();
        setIsSubmitting(false);
      } else  {
        setIsSubmitting(false);
      }
    }
  }, [errors]);

  const handleChange = e => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setIsSubmitting(true);
  };

  return [handleChange, handleSubmit, handleBlur, values, errors, isSubmitting];
}

export default useFormValidation;
