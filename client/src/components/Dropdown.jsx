/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';

function Dropdown(props) {
  const { options, selected, setSelected } = props;
  //   const [selected, setSelected] = React.useState([]);

  const handleChange = (e) => {
    const newSelected = [...selected];
    if (e.target.checked) {
      newSelected.push(e.target.value);
    } else {
      newSelected.splice(newSelected.indexOf(e.target.value), 1);
    }
    setSelected(newSelected);
  };
  if (!options || !options.length) return null;
  return (
    <div className="flex flex-col">

      <div className="border rounded py-2">
        {options.map((option) => (
          <label
            key={option.id}
            className="block
            px-4
            py-2
            leading-5
            text-gray-700
            hover:bg-gray-100
            hover:text-gray-900
            focus:outline-none
            focus:bg-gray-100
            focus:text-gray-900"
          >
            <input
              type="checkbox"
              value={option.id}
              onChange={handleChange}
              checked={selected.includes(option.id)}
              className="mr-2 leading-tight"
            />
            {option.option}
          </label>
        ))}
      </div>

      <div className="mt-2 flex items-center">
        {selected.map((option) => (
          <span key={option} className="mr-4">
            {option}
            <button
              type="button"
              onClick={() => {
                setSelected(selected.filter((x) => x !== option));
              }}
              className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-500 text-white"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Dropdown;
