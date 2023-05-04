import React from 'react';

function FormButton({ handleClick, title }) {
  return (
    <div id="button" className="row">
      <button type="submit" onClick={() => handleClick()}>{title}</button>
    </div>
  );
}

export default FormButton;
