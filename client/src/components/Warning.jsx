import React from 'react';

function Warning({ message, onClose }) {
  return (
    <span className="text-black-500 bg-red text-center">
      {message}
      <button type="button" onClick={() => { onClose(''); }}>❌</button>
    </span>

  );
}
// should be have delete icon to close the warning

export default Warning;
