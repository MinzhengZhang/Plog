import React from 'react';

function FormInput(props) {
  const { type, placeholder } = props;
  return (
    <div className="row">
      <input type={type} placeholder={placeholder} />
    </div>
  );
}

export default FormInput;
