/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FollowsButton from './FollowsButton';
import FollowsButton2 from './FollowsButton2';
import {
  getUserByUserId, getPostsByUserId, getFollowsByFolloweeId,
  getFollowsByFollowerId, getmutualFriends,
} from '../api/api_calls';

export function UserAvatar(props) {
  const { user, relationship, currUserId } = props;
  const { avatar, userId } = user;

  if (avatar) {
    return (
      <span className="group inline-block w-10 h-10 mr-2 rounded-full hover:block">

        <UserInfoHover user={user} relationship={relationship} currUserId={currUserId} />
        <Link
          to={`/profile/${userId}`}
        >
          <img
            className="w-10 h-10 rounded-full"
            src={avatar}
            alt="user avatar"
          />

        </Link>
      </span>
    );
  }
  return (
    <Link
      to={`/profile/${userId}`}
    >
      <span className="inline-block w-10 h-10 mr-2 bg-gray-100 rounded-full dark:bg-gray-600">

        <svg
          className="w-10 h-10 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>

      </span>
    </Link>
  );
}

export function UserNameCell(props) {
  const { userId, username } = props;
  if (username) {
    return (
      <span className="mr-1">
        <Link to={`/profile/${userId}`}>{username}</Link>
      </span>
    );
  }
  return (
    <span className="mr-1">
      <a href="./#">Annonymous</a>
    </span>
  );
}

export function UserFollowStatus({ followerId, followeeId }) {
  return (
    <FollowsButton followeeId={followeeId} followerId={followerId} />
  );
}

function UserInfo(props) {
  const { userId, currUserId } = props;
  const [user, setUser] = useState(undefined);

  const [relationship, setRelationship] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const posts = await getPostsByUserId(userId);
        const postsNum = posts.length;
        const following = await getFollowsByFollowerId(userId);
        const followingNum = following.length;
        const followers = await getFollowsByFolloweeId(userId);
        const followersNum = followers.length;
        const response = await getUserByUserId(userId);
        response.postsNum = postsNum;
        response.followingNum = followingNum;
        response.followersNum = followersNum;
        setUser(response);
        const mutualFriends = (await getmutualFriends(currUserId, userId)).length;
        setRelationship({ mutualFriends });
        // need get relationship endpoint
      } catch (err) {
        throw new Error(err);
      }
    };
    fetchData();
  }, [userId]);

  if (!user) {
    return null;
  }
  if (currUserId === user.userId) {
    return (
      <div className="inline-block">
        <span className="flex items-center">
          <UserAvatar user={user} relationship={{ mutualFriends: 0 }} currUserId={currUserId} />
          <span className="flex items-center">
            <UserNameCell username={user.username} userId={user.userId} />
          </span>
        </span>
      </div>
    );
  }
  return (
    <div className="inline-block">
      <span className="flex items-center">
        <UserAvatar user={user} relationship={relationship} />
        <span className="flex items-center">
          <UserNameCell username={user.username} userId={user.userId} />
          <UserFollowStatus followerId={currUserId} followeeId={user.userId} />
        </span>
      </span>
    </div>
  );
}

function UserInfoHover(props) {
  const { user, relationship, currUserId } = props;
  const {
    userId, username, avatar, description, postsNum, followersNum, followingNum,
  } = user;
  const { mutualFriends } = relationship;
  return (
    <div role="dialog" className="absolute mt-8 bg-white px-4 py-4 w-72 shadow rounded cursor-default z-10 hidden group-hover:block ">
      <div className="flex space-x-3">
        <div className="flex flex-shrink-0">
          <img src={avatar} alt="avatar" className="h-16 w-16 object-fill rounded-full" />
        </div>
        <div className="flex flex-col space-y-2">
          <div className="font-semibold">
            <Link to={`/profile/${userId}`} className="hover:underline">
              {username}
            </Link>
          </div>
          <div className="text-gray-500 text-sm ">{description}</div>
          {mutualFriends && mutualFriends > 0 ? (
            <div className="flex justify-start items-center space-x-2">
              <div>
                <svg className="w-4 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
              </div>
              <div className="w-auto text-sm leading-none">
                <small>
                  {mutualFriends}
                  {' '}
                  mutual friends
                </small>
              </div>
            </div>
          ) : null}

          <div className="flex justify-start items-center space-x-2">
            <div>
              <svg className="w-4 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
            </div>
            <div className="w-auto text-sm leading-none">
              <small>
                has
                {' '}
                {postsNum}
                {' '}
                posts
              </small>
            </div>
          </div>

        </div>
      </div>

      <div className="flex space-x-1 mt-2">
        <div className="w-1/2">
          {/* <div className="text-xs
          text-blue-600
           hover:bg-opacity-60
            font-semibold
             flex items-center justify-center px-3 py-2 bg-blue-300 bg-opacity-50 rounded-lg">
            <div className="mr-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" /></svg>
            </div>
            Add
          </div> */}
          <FollowsButton2 followeeId={userId} followerId={currUserId} />
        </div>

      </div>
      <div>
        <span className="mr-3">
          <span className="font-bold">
            { followingNum }
            {' '}
          </span>
          <span className="font-normal">Following</span>
        </span>
        <span className="ml-3">
          <span className="font-bold">
            {followersNum}
            {' '}
          </span>
          <span className="font-normal">Followers</span>
        </span>
      </div>
    </div>
  );
}

export default UserInfo;
