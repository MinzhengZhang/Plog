import React from 'react';
import { Link } from 'react-router-dom';
import FeedContent from './FeedContent';
import Tags from './Tags';
import Time from './Time';
import ReactionButtons from './ReactionButtons';
import UserInfo from './UserInfo';

export function PostTime({ timeStamp }) {
  const updateTime = <Time timeStamp={timeStamp} />;
  if (updateTime) {
    return (
      <span className="inline-block ml-2 text-gray-400">
        updated
        {' '}
        {updateTime}
      </span>
    );
  }
}

function Feed(props) {
  const {
    post, currUserId,
  } = props;

  if (!post || !post.postId || !post.postContent) {
    return null;
  }
  const {
    tags, timeStamp, postContent,
  } = post;

  return (
    <div className="block ml-1 mr-1 p-3 w-full bg-white rounded-lg border border-gray-200 box-content shadow-md dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg">

      <div className="block flex items-center mb-1">
        <UserInfo userId={post.userId} currUserId={currUserId} />
        <PostTime timeStamp={timeStamp} />
      </div>

      <hr />
      {tags && tags.length && <Tags tags={tags} />}
      <Link to={`/posts/${post.postId}`}>
        <div>
          <FeedContent postContent={postContent} />
        </div>
      </Link>
      {/* props: type, likesCount, commentsCount, currUserId, objectId, */}
      <ReactionButtons type="post" currUserId={currUserId} objectId={post.postId} postId={post.postId} />

    </div>
  );
}

export default Feed;
