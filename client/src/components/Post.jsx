import { React, useEffect, useState } from 'react';

import CommentsTable from './CommentsTable';
import { getPostByPostId, getCommentsByPostId } from '../api/api_calls';
import PostDisplay from './PostDisplay';

function Post(props) {
  const {
    postId, currUserId,
  } = props;
  const [post, setPost] = useState(undefined);
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const getPost = async () => {
      if (!post) {
        try {
          const postObject = await getPostByPostId(postId, currUserId);
          setPost(postObject);
        } catch (err) {
          throw new Error(err.message);
        }
      }
    };
    getPost();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    const getComments = async () => {
      try {
        const commentsArray = await getCommentsByPostId(postId);
        const commentsIds = commentsArray.map((comment) => comment.commentId);
        setComments(commentsIds);
      } catch (err) {
        throw new Error(err.message);
      }
    };
    getComments();
  }, [postId]);

  if (!post) {
    return null;
  }

  return (
    <div className="relative">
      <div className="absolute left-20 top-2 block ">
        <PostDisplay currUserId={currUserId} postId={post.postId} />
      </div>
      <div className="absolute right-10 top-2 block w-auto">
        <CommentsTable currUserId={currUserId} commentsIds={comments} postId={postId} />
      </div>
    </div>

  );
}
export default Post;
