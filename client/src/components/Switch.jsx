import React from 'react';

function Switch(props) {
  const { toggle, setToggle } = props;

  const toggleClass = ' transform translate-x-6';
  return (
    <div className="flex flex-col justify-center items-center ">
      <button
        type="button"
        className="md:w-14 md:h-7 w-12 h-5 flex items-center bg-gray-400 rounded-full p-1 cursor-pointer"
        onClick={() => {
          setToggle(!toggle);
        }}
      >

        <div
          className={
              `bg-black md:w-6 md:h-6 h-4 w-5 rounded-full shadow-md transform duration-300 ease-in-out${
                toggle ? null : toggleClass}`
            }
        />
      </button>
    </div>
  );
}

export default Switch;
