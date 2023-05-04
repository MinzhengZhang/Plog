import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactionButtons from './ReactionButtons';
import PostCreation from './PostCreation';
import PostContent from './PostContent';
import { deletePost, getPostByPostId } from '../api/api_calls';
import Time from './Time';
import Tags from './Tags';
import UserInfo from './UserInfo';

export default function PostDisplay({ currUserId, postId }) {
  const navigate = useNavigate();
  const [post, setPost] = useState(undefined);
  const [editPattern, setEditPattern] = useState(false);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postObject = await getPostByPostId(postId, currUserId);
        setPost(postObject);
      } catch (err) {
        throw new Error(err.message);
      }
    };
    fetchPost();
  }, [editPattern]);

  if (!post || !post.postId || !post.userId) {
    return null;
  }
  const {
    postContent, timeStamp, tags,
  } = post;

  const handleEditClick = () => {
    setEditPattern(true);
  };
  const handleDeleteClick = async () => {
    if (post && post.postId) {
      try {
        await deletePost(currUserId, post.postId);
      } catch (err) {
        throw new Error(err.message);
      }
    }
    navigate(`/profile/${currUserId}`);
  };

  // temp format, need to modify later
  const EditButton = (
    <button
      className="text-xl font-bold mt-4 ml-4 border-2
  text-green-900 border-green-900 hover:bg-green-500
  focus:outline-none focus:ring-4
  focus:ring-green-300 font-medium rounded-full
  text-sm px-8 py-2 text-center mr-2 mb-2
  dark:bg-green-600 dark:hover:bg-green-700
  dark:focus:ring-green-800"
      type="button"
      onClick={handleEditClick}
    >
      Edit
    </button>
  );
  const DeleteButton = (
    <button
      className=" text-xl font-bold mt-4 ml-4 border-2
  text-red-900 border-red-900 hover:bg-red-500
  focus:outline-none focus:ring-4
  focus:ring-green-300 font-medium rounded-full
  text-sm px-5 py-2 text-center mr-2 mb-2
  dark:bg-red-600 dark:hover:bg-red-700
  dark:focus:ring-green-800"
      type="button"
      onClick={handleDeleteClick}
    >
      Delete
    </button>
  );

  if (editPattern) {
    return (
      <div>
        <PostCreation post={post} currUserId={currUserId} type="edit" setEditPattern={setEditPattern} />
      </div>
    );
  }

  return (
    <div className="shadow rounded-md bg-white w-full max-w-lg h-48">
      <UserInfo userId={post.userId} currUserId={currUserId} />
      {currUserId === post.userId ? EditButton : null}
      {currUserId === post.userId ? DeleteButton : null}
      <hr />
      <div className="px-5 py-3">
        <h3 className="font-bold text-xs">TAGS</h3>
        <Tags tags={tags} />
      </div>

      <hr />
      <PostContent postContent={postContent} />
      <div>
        <Time timeStamp={timeStamp} />
      </div>
      <ReactionButtons type="post" objectId={post.postId} currUserId={currUserId} postId={post.postId} />
    </div>

  );
}
