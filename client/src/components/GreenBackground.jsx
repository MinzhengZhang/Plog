import React from 'react';
import greenImg from '../assets/image/GreenImg.png';

function GreenBackground() {
  return (
    <img className="fixed top-0 left-0 h-screen inset-x-2/3" src={greenImg} alt="Cover" />
  );
}
export default GreenBackground;
