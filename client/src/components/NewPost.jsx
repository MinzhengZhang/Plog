import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import PostCreation from './PostCreation';
import Banner from './Banner';

export default function NewPost() {
  const currUserId = useSelector((state) => state.loginStatus.user.userId);
  return (
    <div className="w-full ">
      <Banner />
      <span className="relative inline-grid grid-cols-4 gap-4">
        <span>
          <Navbar className="col-span-1" />
        </span>
        <span className="absolute left-1/4 w-full mt-8 col-span-3">
          <PostCreation currUserId={currUserId} type="post" />
        </span>
      </span>
    </div>
  );
}
