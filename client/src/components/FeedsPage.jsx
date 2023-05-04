import React from 'react';
import { useSelector } from 'react-redux';
import Banner from './Banner';
import Navbar from './Navbar';
import FeedsTable from './FeedsTable';
import FollowSuggestions from './FollowSuggestions';

function FeedsPage() {
  // const user = useSelector((state) => state.loginStatus.user);
  const currUserId = useSelector((state) => state.loginStatus.user.userId);
  if (!currUserId) return <div>loading...</div>;
  return (
    <div>
      <Banner />
      <Navbar />
      <FeedsTable currUserId={currUserId} />
      <FollowSuggestions currUserId={currUserId} />
    </div>
  );
}

export default FeedsPage;
