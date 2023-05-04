import React, { useEffect, useRef, useState } from 'react';
import { getFollowsByFollowerId, getUserByUserId } from '../api/api_calls';
import UserInfo from './UserInfo';

function FollowingTable({ userId, currUserId }) {
  const [following, setFollowing] = useState([]);
  const firstRendering = useRef(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getFollowsByFollowerId(userId);
        const followees = [];
        for (let i = 0; i < data.length; i += 1) {
          const followee = getUserByUserId(data[i].followeeId);
          followees.push(followee);
        }
        setFollowing(await Promise.all(followees));
      } catch (error) {
        throw new Error(error.message);
      }
    }
    if (firstRendering.current) {
      firstRendering.current = false;
      fetchData();
    }
  });

  let followsComponents;

  if (following.length > 0) {
    followsComponents = following.map((followee) => {
      if (followee && followee.userId) {
        return (
          <div className="block mb-2" key={followee.userId}>
            <UserInfo userId={followee.userId} currUserId={currUserId} />
          </div>
        );
      }
      return null;
    });
  } else {
    followsComponents = (
      <h1 className="font-bold text-xl">
        There is no current following.
      </h1>
    );
  }

  return (
    <div>{followsComponents}</div>
  );
}

export default FollowingTable;
