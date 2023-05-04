import React from 'react';
import { Link } from 'react-router-dom';
import FollowsButton from './FollowsButton';

function SearchResult({ user, isUserView, currUserId }) {
  let followButton = <span />;
  if (isUserView) {
    followButton = <FollowsButton followerId={currUserId} followeeId={user.userId} />;
  }

  return (
    <div className="searchResult flex items-center">

      <Link className="flex items-center mb-2" to={`/profile/${user.userId}`}>
        <span>
          <img className="avatar inline-block w-10 h-10 mr-2 rounded-full" src={user.avatar} alt="User Profile" />
        </span>
        <span className="ml-2 mr-1">
          {user.username}
        </span>
      </Link>

      {/* <span><button type="submit"> +Follow </button></span> */}
      {followButton}
    </div>
  );
}

export default SearchResult;
