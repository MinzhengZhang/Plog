import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import FormButton from './FormButton';
import GoogleSignIn from './GoogleSignIn';
import GreenBackground from './GreenBackground';
// import API functions
import { createUser } from '../api/api_calls';

function Msg({ regResult }) {
  if (regResult === 'success') {
    return (<div className="text-[#37AC34] font-bold text-left"> Success! Please sign in to your account now. </div>);
  }
  if (regResult === 'failed') {
    return (<div className="text-[#37AC34] font-bold text-left"> Your registration failed.Please try again. </div>);
  }
  return (<div> </div>);
}
export default function Register() {
  const navigate = useNavigate();
  const routeChange = () => {
    const path = '/';
    navigate(path);
  };

  let newEmail;
  let newUsername;
  let newPassword;
  const handleOnChange = (e) => {
    if (e.target.placeholder === 'Email') {
      newEmail = e.target.value;
    }
    if (e.target.placeholder === 'Username') {
      newUsername = e.target.value;
    }
    if (e.target.placeholder === 'Password') {
      newPassword = e.target.value;
    }
  };

  const [regResult, setRegResult] = useState();
  const handleRegisterUser = async (e) => {
    // stop default behavior to avoid reloading the page
    e.preventDefault();
    // create new student variable
    const newUser = { userEmail: newEmail, username: newUsername, password: newPassword };
    // clear the form
    const form = document.getElementById('register');
    form.reset();
    // send POST request to create the student
    try {
      const res = await createUser(newUser);
      if (Object.keys(res).length > 0) {
        setRegResult(() => 'success');
      } else {
        setRegResult(() => 'failed');
      }
    } catch (err) {
      setRegResult(() => 'failed');
      throw new Error(err.message);
    }
  };
  return (
    <div className="Register">
      <div>
        <GreenBackground />
      </div>
      <div className="RegisterContent">
        <Logo />
        <h2 className="text-2xl font-bold p-1">Sign up to see plogs from friends</h2>
        <div>
          <form id="register" onSubmit={handleRegisterUser}>
            <div className="row">
              <input placeholder="Email" type="email" onChange={handleOnChange} />
            </div>
            <div className="row">
              <input placeholder="Username" type="text" onChange={handleOnChange} />
            </div>
            <div className="row">
              <input placeholder="Password" type="password" onChange={handleOnChange} />
            </div>
            <div className="row" id="button">
              <button type="submit" onClick={handleRegisterUser}> Sign Up</button>
            </div>
          </form>
        </div>
        <div className="policy">
          By signing up, you agree to our
          <b> Terms, Privacy Policy, and Cookies Policy</b>
          .
        </div>
        <GoogleSignIn />
        <div className="forgotPassword">
          Forgot password?
        </div>
        <h5 className="text-bg p-1">
          Have an account?
        </h5>
        <div><FormButton title="Log In" handleClick={routeChange} /></div>
        <Msg regResult={regResult} />
      </div>
    </div>
  );
}
