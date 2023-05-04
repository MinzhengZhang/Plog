import React from 'react';
import GoogleIcon from '../assets/image/GoogleIcon.png';

function GoogleSignIn() {
  return (
    <div className="googleSignin">
      <h5> or </h5>
      <span>
        <img src={GoogleIcon} alt="Google Icon" />
        Log in with Google
      </span>
    </div>
  );
}
export default GoogleSignIn;
