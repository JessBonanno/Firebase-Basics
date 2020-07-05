import React, { useState, useContext } from 'react';
import FirebaseContext from '../../firebase/context';

function ForgotPassword() {
  const [resetPasswordEmail, setResetPasswordEmail] = useState();
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState(null);
  const { firebase } = useContext(FirebaseContext);

  async function handleResetPassword() {
    try {
      await firebase.resetPassword(resetPasswordEmail);
      setIsPasswordReset(true);
      setPasswordResetError(null);
    } catch (err) {
      console.error('Error sending email', err);
      setPasswordResetError(err.message);
      setIsPasswordReset(false);
    }
  }

  return (
    <div>
      <input
        type='email'
        className='input'
        placeholder='Provide your account email'
        onChange={e => setResetPasswordEmail(e.target.value)}
      />
      <div>
        <button className='button' onClick={handleResetPassword}>
          Reset Password
        </button>
      </div>
      {isPasswordReset && <p>Check your email to reset password</p>}
      {passwordResetError && <p className='error-text'>{passwordResetError}</p>}
    </div>
  );
}

export default ForgotPassword;
