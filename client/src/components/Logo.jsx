import React from 'react';
import logo from '../assets/image/Logo.jpg';

function Logo() {
  return (
    <span className="logo">
      <img className="logoImg" src={logo} alt="Plog Icon" />
    </span>
  );
}
export default Logo;
