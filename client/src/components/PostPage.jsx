import { React } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Post from './Post';
import Navbar from './Navbar';
import Banner from './Banner';

function PostPage() {
  const { id } = useParams();
  const currUserId = useSelector((state) => state.loginStatus.user.userId);

  return (
    <div className="ralative w-full h-full">
      <Banner />
      <Navbar currUserId={currUserId} />
      <div className="absolute left-64 top-32 w-5/6 h-4/5">
        <Post currUserId={currUserId} postId={id} />
      </div>
    </div>
  );
}

export default PostPage;
