import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSuggestions } from '../api/api_calls';
import FollowsButton2 from './FollowsButton2';

function FollowSuggestion({ user, isUserView, currUserId }) {
  if (!currUserId) {
    return null;
  }

  let followButton = <span />;
  if (isUserView) {
    followButton = <FollowsButton2 followerId={currUserId} followeeId={user.userId} />;
  }

  return (
    <div className="flex items-center">

      <Link className="flex items-center mb-2" to={`/profile/${user.userId}`}>
        <span>
          <img className="avatar inline-block w-10 h-10 mr-2 rounded-full" src={user.avatar} alt="User Profile" />
        </span>
        <span className="ml-2 mr-1">
          {user.username}
        </span>
      </Link>

      {followButton}

    </div>
  );
}

function FollowSuggestions({ currUserId }) {
  const firstRendering = useRef(true);
  const [suggestList, setSuggestList] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const suggestedUsers = await getSuggestions(currUserId);
        setSuggestList(() => suggestedUsers);
      } catch (err) {
        throw new Error(err.message);
      }
    }
    if (firstRendering.current) {
      firstRendering.current = false;
      fetchData();
    }
  });

  let suggestionTable;
  if (suggestList.length > 0) { // suggestionTable &&
    suggestionTable = suggestList.map((user) => (
      <FollowSuggestion
        key={Math.random() * Math.random() * 100}
        user={user}
        isUserView
        currUserId={currUserId}
      />
    ));
  }
  return (
    <div className="absolute left-3/4 top-28 p-3 w-1/5">
      <h1 className="mt-2 mb-3 font-bold text-3xl block">You may like</h1>
      <div className="items-center w-auto px-2">
        {suggestionTable}
      </div>
    </div>
  );
}

export default FollowSuggestions;
