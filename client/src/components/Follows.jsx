import React from 'react';
import { useSelector } from 'react-redux';
import Banner from './Banner';
import Navbar from './Navbar';
import FollowingTable from './FollowingTable';

function Follows() {
  const currUserId = useSelector((state) => state.loginStatus.user.userId);
  return (
    <div>
      <Banner />
      <Navbar />
      <div className="component">
        <h2 className="text-2xl font-bold mb-4">Followings</h2>
        <FollowingTable userId={currUserId} currUserId={currUserId} />
      </div>
    </div>
  );
}

export default Follows;
