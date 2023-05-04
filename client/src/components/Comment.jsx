import { React, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Time from './Time';
import UserInfo from './UserInfo';
import ReactionButtons from './ReactionButtons';
import {
  deleteComment, getCommentByCommentId, updateComment,
} from '../api/api_calls';

function CommentTime({ timeStamp }) {
  const updateTime = <Time timeStamp={timeStamp} />;
  if (updateTime) {
    return (
      <span className="inline-block ml-2 text-gray-400">
        commented
        {' '}
        {updateTime}
      </span>
    );
  }
  return null;
}

function Comment(props) {
  const { currUserId, commentId } = props;

  const [comment, setComment] = useState(undefined);
  const [editPattern, setEditPattern] = useState(false);
  const dispatch = useDispatch();
  const handleDeleteComment = async () => {
    if (currUserId !== comment.userId) {
      return;
    }
    try {
      await deleteComment(currUserId, commentId);
      dispatch({ type: 'DELETE_COMMENT', commentId });
    } catch (err) {
      throw new Error(err.message);
    }
  };
  const handleEditComment = async () => {
    setEditPattern(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commentObject = await getCommentByCommentId(commentId);
        setComment(commentObject);
      } catch (err) {
        throw new Error(err.message);
      }
    };
    fetchData();
  }, [editPattern]);

  if (!comment) {
    return null;
  }
  if (editPattern) {
    return (
      <CommentEdit
        currUserId={currUserId}
        comment={comment}
        setEditPattern={setEditPattern}
      />
    );
  }
  let names = [];
  if (comment.content) {
    const feedText = comment.content;
    names = feedText.split(/<a[^>]*>(.*?)<\/a>/g);
    const links = feedText.split(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g);
    for (let i = 1; (2 * i - 1) < names.length; i += 1) {
      const name = names[2 * i - 1];
      names[2 * i - 1] = (
        <span className="text-blue-500" key={Math.random() * (3 * i - 1)}>
          <Link to={links[3 * i - 1]}>
            {name}
          </Link>
        </span>
      );
    }
  }
  const { userId } = comment;
  return (
    <div className="relative flex-col w-full py-4 mx-auto mt-3 bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-4 md:px-4 sm:rounded-lg sm:shadow-sm " key={comment.commentId}>
      <div className="block flex items-center mb-1">
        <UserInfo userId={userId} currUserId={currUserId} />
        <CommentTime timeStamp={comment.timeStamp} />
      </div>
      {currUserId === userId
        ? (
          <button type="button" id={userId} onClick={handleDeleteComment} className="absolute top-2 right-2 -mr-1 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 h-4 w-4 rounded-full flex justify-center items-center">
            <svg className="h-2 w-2 fill-current items-center" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" /></svg>
          </button>
        )
        : null}
      <hr />
      <div>
        {names}
      </div>
      <hr />
      <ReactionButtons type="comment" currUserId={currUserId} objectId={commentId} postId={comment.postId} />
      {currUserId === userId
        ? (
          <button type="button" id={userId} onClick={handleEditComment} className="button">
            Edit
          </button>
        )
        : null}
    </div>

  );
}

function CommentEdit(props) {
  const { currUserId, comment, setEditPattern } = props;
  const [content, setContent] = useState(comment.content);
  const handleOnChange = (event) => {
    setContent(event.target.value);
  };
  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const requestBody = {
      commentId: comment.commentId,
      userId: comment.userId,
      postId: comment.postId,
      content,
      timeStamp: new Date().getTime(),
      affiliatedComment: comment.affiliatedComment,
    };
    try {
      if (content && content !== '') {
        await updateComment(currUserId, requestBody);
        setEditPattern(false);
      }
    } catch (e) {
      throw new Error(e.message);
    }
  };
  return (
    <div className="max-w-lg shadow-md">
      <form action="" className="w-full p-4">
        <label className="block mb-2" htmlFor="comment">
          <span className="text-gray-600">Editing comment</span>
          <textarea className="block w-full mt-1 rounded" id="comment" rows="3" onChange={handleOnChange} value={content} required />
        </label>
        <button type="button" className="px-3 py-2 text-sm text-blue-100 bg-blue-600 rounded" onClick={handleOnSubmit}>Update</button>
      </form>
    </div>
  );
}

export default Comment;
