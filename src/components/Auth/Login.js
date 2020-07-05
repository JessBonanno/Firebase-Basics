import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import useFormValidation from './useFormValidation';
import validateLogin from './validateLogin';
import firebase from '../../firebase';

const INITIAL_STATE = {
  name: '',
  email: '',
  password: '',
};

function Login(props) {
  const [
    handleChange,
    handleSubmit,
    handleBlur,
    values,
    errors,
    isSubmitting,
  ] = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser);
  const history = useHistory();
  const [login, setLogin] = useState(true);
  const [firebaseError, setFirebaseError] = useState(null);

  async function authenticateUser() {
    const { name, email, password } = values;
    try {
      login
        ? await firebase.login(email, password)
        : await firebase.register(name, email, password);
      history.push('/');
    } catch (err) {
      console.error('Auth Error', err);
      setFirebaseError(err.message);
    }
  }

  return (
    <div>
      <h2 className='mv3'>{login ? 'Login' : 'Create Account'}</h2>
      <form className='flex flex-column' onSubmit={handleSubmit}>
        {!login && (
          <input
            name='name'
            value={values.name}
            onChange={handleChange}
            type='text'
            placeholder='Your Name'
            autoComplete='off'
          />
        )}
        <input
          name='email'
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
          type='email'
          className={errors.email && 'error-input'}
          placeholder='Your Email'
          autoComplete='off'
        />
        {errors.email && <p className='error-text'>{errors.email}</p>}
        <input
          name='password'
          value={values.password}
          onBlur={handleBlur}
          onChange={handleChange}
          type='password'
          className={errors.password && 'error-input'}
          placeholder='Choose a secure password'
        />
        {errors.password && <p className='error-text'>{errors.password}</p>}
        {firebaseError && <p className='error-text'>{firebaseError}</p>}
        <div className='flex mt3'>
          <button
            type='submit'
            className='button pointer mr2'
            disabled={isSubmitting}
            style={{ background: isSubmitting ? 'grey' : 'orange' }}>
            Submit
          </button>
          <button
            type='button'
            className='pointer button'
            onClick={() => setLogin(prevLogin => !prevLogin)}>
            {login ? 'need to create an account?' : 'already have an account?'}
          </button>
        </div>
      </form>
      <Link to='/forgot'>Forgot password?</Link>
    </div>
  );
}

export default Login;
