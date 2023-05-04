import React from 'react';

function Tags({ tags }) {
  // const url = '/search?q=';
  if (!tags || !tags.length) {
    return null;
  }

  const filteredTags = tags.filter((tag) => tag !== '');
  if (!filteredTags.length) {
    return null;
  }

  const tagsComponents = filteredTags.map((tag) => {
    if (tag && tag !== '') {
      return (
        <span
          key={tag}
          className="m-1 bg-gray-200 hover:bg-gray-300 rounded-full px-2 font-bold text-sm leading-loose cursor-pointer"
        >
          <span>
            #
            {tag}
          </span>
        </span>
      );
    }
    return null;
  });

  return (
    <div className="flex items-center my-1 flex flex-wrap -m-1">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
      <b>{'Tags: '}</b>
      {tagsComponents}
    </div>
  );
}

export default Tags;
