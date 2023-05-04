import {
  React, useEffect, useState,
} from 'react';
// import { v4 } from 'uuid';
import { Num } from './Navbar';
import QuickComment from './QuickComment';
import {
  likePost, likeComment, unlikePost, unlikeComment, getLikesNumByPostId,
  getLikesNumByCommentId, getPostIsLiked, getCommentIsLiked, getCommentsByPostId,
  getCommentByCommentId,
} from '../api/api_calls';

export function LikeButton({
  type, currUserId, objectId,
}) {
  const [likeState, setLikeState] = useState(false);
  const [likesCountState, setLikesCountState] = useState(0);
  useEffect(() => {
    const getLikeState = async () => {
      let isLiked = likeState;
      if (type === 'post') {
        try {
          isLiked = await getPostIsLiked(currUserId, objectId);
        } catch (err) {
          throw new Error(err.message);
        }
      } else if (type === 'comment') {
        try {
          isLiked = await getCommentIsLiked(currUserId, objectId);
        } catch (err) {
          throw new Error(err.message);
        }
      }
      if (isLiked !== likeState) {
        setLikeState(isLiked);
      }
    };

    getLikeState();
  }, [currUserId]);

  useEffect(() => {
    const updateLikesCount = async () => {
      if (type === 'post') {
        try {
          const count = await getLikesNumByPostId(objectId);
          if (count !== likesCountState) {
            setLikesCountState(count);
          }
        } catch (err) {
          throw new Error(err.message);
        }
      } else {
        try {
          const count = await getLikesNumByCommentId(objectId);
          if (count !== likesCountState) {
            setLikesCountState(count);
          }
        } catch (err) {
          throw new Error(err.message);
        }
      }
    };

    updateLikesCount();

    const interval = setInterval(() => {
      updateLikesCount();
    }, 2000);
    return () => clearInterval(interval);
  }, [likeState, likesCountState]);

  async function handleUnlike() {
    if (type === 'post') {
      try {
        if (await unlikePost(currUserId, objectId) === 1) {
          setLikeState(false);
        }
      } catch (err) {
        throw new Error(err.message);
      }
    } else {
      try {
        if (await unlikeComment(currUserId, objectId) === 1) {
          setLikeState(false);
        }
      } catch (err) {
        throw new Error(err.message);
      }
    }
  }

  async function handleLike() {
    if (type === 'post') {
      const reqBody = {
        userId: currUserId,
        postId: objectId,
        timeStamp: new Date().getTime(),
      };
      try {
        if (await likePost(currUserId, reqBody)) {
          setLikeState(true);
        }
      } catch (err) {
        throw new Error(err.message);
      }
    } else {
      const reqBody = {
        userId: currUserId,
        commentId: objectId,
        timeStamp: new Date().getTime(),
      };
      try {
        if (await likeComment(currUserId, reqBody) === 1) {
          setLikeState(true);
        }
      } catch (err) {
        throw new Error(err.message);
      }
    }
  }

  if (likeState) {
    return (
      <div className="inline-block mr-3" onClick={handleUnlike} onKeyPress={() => { }} role="button" tabIndex="0">
        <div className=" inline-block w-6 h-6 rounded-full hover:bg-red-100 hover:scale-110">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="fill-red-400">
            <g>
              <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z" />
            </g>
          </svg>
        </div>
        <span>
          <Num count={likesCountState} />
        </span>
      </div>
    );
  }
  return (
    <div className="inline-block mr-3" onClick={handleLike} onKeyPress={() => { }} role="button" tabIndex="0">
      <div className="inline-block w-6 h-6 rounded-full hover:bg-red-100 hover:scale-110">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="r-4qtqp9 r-yyyyoo r-1xvli5t r-dnmrzs r-bnwqim r-1plcrui r-lrvibr r-1hdv0qi hover:stroke-red-300"
        >
          <g>
            <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z" />
          </g>
        </svg>
      </div>
      <span>
        <Num count={likesCountState} />
      </span>
    </div>
  );
}

// type = 'post' or 'comment', objectId = post_id or comment_id, currUserId = current user id
export function CommentButton({
  type, objectId, currUserId, postId,
}) {
  const [commentsCount, setCommentsCount] = useState(0);
  const [quickCommentMode, setQuickCommentMode] = useState(false);
  const [userQuickCount, setUserQuickCount] = useState(0);
  useEffect(() => {
    const updateCommentsCount = async () => {
      if (type === 'post') {
        try {
          let count = commentsCount;
          const comments = await getCommentsByPostId(objectId);
          if (comments && comments.length) {
            count = comments.length;
          }
          if (count !== commentsCount) {
            setCommentsCount(count);
          }
        } catch (err) {
          throw new Error(err.message);
        }
      } else {
        try {
          let count = commentsCount;
          const comments = await getCommentByCommentId(objectId); // search affiliated comments
          if (comments && comments.length) {
            count = comments.length;
          }
          if (count !== commentsCount) {
            setCommentsCount(count);
          }
        } catch (err) {
          throw new Error(err.message);
        }
      }
    };
    updateCommentsCount();
    const interval = setInterval(() => {
      updateCommentsCount();
    }, 2000);
    return () => clearInterval(interval);
  }, [userQuickCount]);
  const handleClickCommentButton = () => {
    setQuickCommentMode(!quickCommentMode);
  };
  if (!quickCommentMode) {
    return (
      <div className="inline-block ml-3 border border-white" onClick={handleClickCommentButton} onKeyPress={() => { }} role="button" tabIndex="0">
        <div className="inline-block rounded-full hover:scale-110 hover:bg-blue-100">
          <svg
            className="hover:stroke-blue-300 w-6 h-6 rounded-full"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <g>
              <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z" />
            </g>
          </svg>
        </div>
        <span>
          <Num count={commentsCount} />
        </span>
      </div>
    );
  }

  return (
    <span>
      <div className="inline-block ml-3 border border-white" onClick={handleClickCommentButton} onKeyPress={() => {}} role="button" tabIndex="0">
        <div className="inline-block rounded-full hover:scale-110 hover:bg-blue-100">
          <svg
            className="hover:stroke-blue-300 w-6 h-6 rounded-full"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <g>
              <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z" />
            </g>
          </svg>
        </div>
        <span>
          <Num count={commentsCount} />
        </span>
      </div>

      <span>
        <QuickComment currUserId={currUserId} postId={postId} commentId={type === 'comment' ? objectId : undefined} setUserQuickCount={setUserQuickCount} userQuickCount={userQuickCount} />
      </span>
    </span>
  );
}

// type here refers to the type of object whether it is a post or a comment
function ReactionButtons({
  type, currUserId, objectId, postId,
}) {
  return (
    <div className="block mt-1">
      <div className="text-center">
        <LikeButton
          currUserId={currUserId}
          type={type}
          objectId={objectId}
        />
        <CommentButton
          currUserId={currUserId}
          type={type}
          objectId={objectId}
          postId={postId}
        />
      </div>
    </div>
  );
}

export default ReactionButtons;
