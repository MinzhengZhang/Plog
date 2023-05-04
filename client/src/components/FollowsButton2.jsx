// including follow button and unfollow button
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { follow, unfollow } from '../redux/actions/appActions';
import { getFollowsByFollowerId, addFollow, deleteFollow } from '../api/api_calls';

function FollowsButton2({ followerId, followeeId }) {
  if (!followerId || !followeeId) {
    return null;
  }
  if (followerId === followeeId) {
    return null;
  }
  const followingStatus = useSelector((state) => state.follow);
  const currUserId = useSelector((state) => state.loginStatus.user.userId);
  // useDispatch
  const dispatch = useDispatch();
  async function handleUnfollow() {
    try {
      await deleteFollow(currUserId, followerId, followeeId);
      dispatch(unfollow(followeeId));
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function handleFollow() {
    const timeStamp = new Date();
    const followObject = { followerId, followeeId, timeStamp };
    try {
      await addFollow(followObject);
      dispatch(follow(followeeId));
    } catch (err) {
      throw new Error(err.message);
    }
  }

  const following = new Set(followingStatus);

  useEffect(() => {
    async function fetchFollowStatus() {
      try {
        const allFollowing = await getFollowsByFollowerId(followerId);
        allFollowing.forEach((followData) => {
        // followData && followData.followeeId &&
          if (!following.has(followData.followeeId)) {
            const userId = followData.followeeId;
            dispatch(follow(userId));
          }
        });
      } catch (err) {
        throw new Error(err.message);
      }
    }
    fetchFollowStatus();
  });

  if (following.has(followeeId)) {
    return (
      <button type="button" onClick={handleUnfollow} className="btn bg-grey-200 border border-black font-bold py-1 px-2 rounded-full flex absolute right-0">
        Following
      </button>
    );
  }
  return (
    <button type="button" onClick={handleFollow} className="btn bg-black text-white font-bold py-1 px-2 rounded-full flex absolute right-0">
      Follow
    </button>
  );
}
export default FollowsButton2;
