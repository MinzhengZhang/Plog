import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Logo from './Logo';
import FormButton from './FormButton';
import GoogleSignIn from './GoogleSignIn';
import GreenBackground from './GreenBackground';
import FeedsPage from './FeedsPage';
import { login } from '../redux/actions/appActions';
import { createLogIn } from '../api/api_calls';

function Msg({ signInResult }) {
  return (
    <div className="text-[#37AC34] font-bold text-left">
      {signInResult}
    </div>
  );
}

function SignIn() {
  const dispatch = useDispatch();
  const handleSignIn = (data) => {
    dispatch(login(data));
  };
  const navigate = useNavigate();
  const routeChange = () => {
    const path = '/register';
    navigate(path);
  };

  let newEmail;
  let newPassword;

  const handleOnChange = (e) => {
    if (e.target.placeholder === 'Email') {
      newEmail = e.target.value || '';
    }
    if (e.target.placeholder === 'Password') {
      newPassword = e.target.value || '';
    }
  };

  const [signInResult, setSignInResult] = useState();
  const handleLogIn = async (e) => {
    // stop default behavior to avoid reloading the page
    e.preventDefault();
    // create new student variable
    const newLogIn = { userEmail: newEmail, password: newPassword };
    // send POST request to create the student
    try {
      const newLogInSession = await createLogIn(newLogIn);
      if (newLogInSession.token) {
        handleSignIn(newLogInSession.user);
      }
      setSignInResult(() => '');
    } catch (err) {
      // console.log('sign in err', err.message);
      if (!err.message) {
        setSignInResult(() => 'Unknown server error occured');
      } else {
        setSignInResult(() => err.message);
      }
    }
    // clear the form
    const form = document.getElementById('SignIn');
    form.reset();
  };

  return (
    <div className="SignIn">
      <div>
        <GreenBackground />
      </div>
      <div className="SignInContent">
        <Logo />
        <h2 className="text-2xl font-bold p-1">Post your plogs today</h2>
        <form id="SignIn" onSubmit={handleLogIn}>
          <div className="row">
            <input placeholder="Email" type="email" onChange={handleOnChange} />
          </div>
          <div className="row">
            <input placeholder="Password" type="password" onChange={handleOnChange} />
          </div>
          <div className="row" id="button">
            <button type="submit" onClick={handleLogIn}> Sign in </button>
          </div>
        </form>
        <GoogleSignIn />
        <div className="forgotPassword">Forgot password?</div>
        <h5 className="text-bg p-1">Don&apos;t have an account?</h5>
        <div>
          <FormButton title="Sign Up" handleClick={routeChange} />
        </div>
        <Msg signInResult={signInResult} />
      </div>
    </div>
  );
}

function LoginComponent() {
  const connected = useSelector((state) => state.loginStatus.isLogin);
  return (
    <div>
      {!connected ? <SignIn />
        : (
          <div>
            <FeedsPage />
          </div>
        )}
    </div>
  );
}
export default LoginComponent;
