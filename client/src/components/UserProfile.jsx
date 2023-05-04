/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import Banner from './Banner';
import Navbar from './Navbar';
import PastPosts from './PastPosts';
import { uploadFileToS3 } from '../api/s3';
import { updateAvatar } from '../redux/actions/appActions';
import FollowsButton2 from './FollowsButton2';
import {
  getPostsByUserId, getFollowsByFolloweeId, getFollowsByFollowerId, getUserByUserId, updateUser,
} from '../api/api_calls';
import FollowingTable from './FollowingTable';

function UserDescription({
  userId, currUserId, user, setUser,
}) {
  if (!user || !setUser || !currUserId || !userId) return null;

  const [userDescription, setUserDescription] = useState(user.description || '');
  const [isEditing, setIsEditing] = useState(false);
  const editDescription = async () => {
    const res = await updateUser(currUserId, { userDescription });
    if (res) {
      setIsEditing(false);
      const newUser = { ...user };
      newUser.description = userDescription;
      setUser(newUser);
    }
  };

  if (!isEditing) {
    return (
      <div className="mt-6 py-6 border-t border-slate-200 text-center">
        <div className="flex flex-wrap justify-center">
          <div className="w-full px-4">
            <p className="font-light leading-relaxed text-slate-600 mb-4">{userDescription}</p>
            {currUserId === userId && <button className="inline-block btn bg-grey-200 border border-black font-bold py-1 px-2 rounded-full flex " type="button" onClick={() => setIsEditing(true)}>Edit</button>}
          </div>
        </div>

      </div>
    );
  }
  return (
    <div className="mt-6 py-6 border-t border-slate-200 text-center">
      <input type="text" className="border w-1/2 h-20" value={userDescription} onChange={(e) => setUserDescription(e.target.value)} />
      <button type="button" className="inline-block btn bg-grey-200 border border-black font-bold py-1 px-2 rounded-full flex" onClick={editDescription}>Update</button>
    </div>
  );
}

function UserAvatarUpdate({ userId, setUser, user }) {
  const dispatch = useDispatch();
  const handleUploadAvatar = async (event) => {
    const img = event.target.files;
    const file = img[0];
    if (!file || !file.type.includes('image')) return;
    const photo = await uploadFileToS3(file, 'avatars');
    if (photo && photo.id && photo.src) {
      const newAvatar = photo.src;
      const newUser = { ...user };
      newUser.avatar = newAvatar;
      const res = await updateUser(userId, { avatar: newAvatar });
      if (res) {
        setUser(newUser);
        dispatch(updateAvatar(newAvatar));
      }
    }
  };

  return (
    <div className=" flex items-center space-x-1 sm:pr-4">
      <label className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" htmlFor="photos">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <input type="file" id="photos" className="hidden" onChange={handleUploadAvatar} />
      </label>
    </div>

  );
}

function UserSummarize(props) {
  const {
    userId, currUserId,
  } = props;
  const [user, setUser] = useState({});
  const [postNum, setPostNum] = useState(0);
  const [followingNum, setFollowingNum] = useState(0);
  const [followerNum, setFollowerNum] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const followingData = await getFollowsByFolloweeId(userId);
      const followerData = await getFollowsByFollowerId(userId);
      const userData = await getUserByUserId(userId);
      const postsData = await getPostsByUserId(userId);
      setUser(userData || {});
      setPostNum(postsData.length || 0);
      setFollowingNum(followingData.length || 0);
      setFollowerNum(followerData.length || 0);
    }
    fetchData();
  }, [userId]);

  return (
    <div className="block w-full max-w-md mx-auto md:max-w-3xl mt-6 break-words bg-white w-full mb-6 shadow-lg rounded-xl mt-16 ">
      <div className="px-6">
        <div className="w-full flex flex-wrap justify-center">
          <div className="w-full flex justify-center">
            <div className="relative">
              <img src={user.avatar} className="shadow-xl w-28 h-28 rounded-full align-middle  border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]" alt="avatar" />
            </div>
          </div>

          <div className="w-full text-center mt-14">
            {currUserId === userId && (
              <div className="flex justify-center">
                <UserAvatarUpdate
                  userId={userId}
                  user={user}
                  setUser={setUser}
                />
              </div>
            )}
            <div className="flex justify-center lg:pt-4 pt-8 pb-0">
              <div className="p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">{postNum}</span>
                <span className="text-sm text-slate-400">Posts</span>
              </div>
              <div className="p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">{followerNum}</span>
                <span className="text-sm text-slate-400">Followers</span>
              </div>

              <div className="p-3 text-center">
                <span className="text-xl font-bold block uppercase tracking-wide text-slate-700">{followingNum}</span>
                <span className="text-sm text-slate-400">Following</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-2">
          <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1">{user.username}</h3>
        </div>
        <UserDescription userId={userId} currUserId={currUserId} user={user} setUser={setUser} />
        <div className="flex justify-center relative right-28 bottom-12">
          <FollowsButton2 followerId={currUserId} followeeId={userId} />
        </div>
      </div>

    </div>
  );
}

export default function UserProfile() {
  const { id } = useParams();
  const userId = id;
  const currUserId = useSelector((state) => state.loginStatus.user.userId);
  const [postsState, setPostsState] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPostsByUserId(userId, currUserId);
        setPostsState(data);
      } catch (err) {
        throw new Error(err.message);
      }
    }
    fetchData();
  }, [id]);

  return (
    <div>
      <Banner />
      <span className="inline-grid grid-cols-4 gap-4">
        <span className="col-span-1">
          <Navbar />
        </span>
        <div className=" w-full col-start-2 col-span-4">
          <UserSummarize
            userId={userId}
            currUserId={currUserId}
          />
        </div>
        <div className="absolute top-2/3 left-1/4 col-span-2  block"><PastPosts posts={postsState} title="Past Posts" /></div>

        <span>
          <div className="col-span-1 absolute right-28 top-40">
            <h2 className="text-2xl font-bold mt-6 mb-2">Followings</h2>
            <FollowingTable
              userId={userId}
              currUserId={currUserId}
            />
          </div>
        </span>
      </span>
    </div>
  );
}
