import React, {
  useEffect, useRef, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import Banner from './Banner';
import { getLikesByUserId, getPostByPostId } from '../api/api_calls';
import PastPosts from './PastPosts';

function LikesPage() {
  const currUserId = useSelector((state) => state.loginStatus.user.userId);
  let { id } = useParams();
  // if link is /likes, then id is default currUserId
  if (id === undefined) {
    id = currUserId;
  }

  const userId = id;
  const [postsState, setPostsState] = useState([]);
  const firstRendering = useRef(true);

  useEffect(() => {
    document.title = 'Likes';
    async function fetchData() {
      try {
        const data = await getLikesByUserId(userId);
        if (data.length === 0) {
          setPostsState([]);
        } else {
          const likesPosts = [];
          for (let i = 0; i < data.length; i += 1) {
            const like = data[i];
            const { objectId } = like;
            let post;
            if (objectId) {
              post = getPostByPostId(objectId, currUserId);
            }
            if (post) {
              likesPosts.push(post);
            }
          }
          const posts = await Promise.all(likesPosts);

          setPostsState(posts);
        }
      } catch (error) {
        throw new Error(error.message);
      }
    }

    if (firstRendering.current) {
      firstRendering.current = false;
      fetchData();
    }
  }, [userId]);

  return (
    <div>
      <Banner />
      <span className="inline-grid grid-cols-4 gap-4">
        <span className="col-span-1">
          <Navbar />
        </span>
        <span className="col-span-2 absolute left-1/3"><PastPosts currUserId={currUserId} posts={postsState} title="Likes" /></span>
      </span>
    </div>
  );
}

export default LikesPage;
