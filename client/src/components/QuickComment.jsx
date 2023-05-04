import { React, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createComment, getCommentByCommentId, getUserByUserId } from '../api/api_calls';
import { addComment } from '../redux/actions/appActions';

function QuickComment({
  currUserId, postId, commentId, userQuickCount, setUserQuickCount,
}) {
  // here if commentId is undefined, then it is a comment on a post,
  // if not undefined, then it is a comment on a comment
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const handleOnChange = (e) => {
    const content = e.target.value;
    setComment(content);
  };

  const handleOnSubmit = async () => {
    const reqBody = {
      userId: currUserId,
      postId,
      content: comment,
      affiliatedComment: commentId,
    };

    if (commentId && commentId !== '') {
      try {
        const replyToComment = await getCommentByCommentId(commentId);
        if (replyToComment && replyToComment.userId) {
          const replyToId = replyToComment.userId;
          const replyTo = await getUserByUserId(replyToId);
          const name = replyTo.username;
          const replyToLink = (`<a href='/profile/${replyToId}'>${name}</a>:`);
          const appendedContent = `replys to ${replyToLink}`;
          reqBody.content = appendedContent + reqBody.content;
        }
      } catch (err) {
        throw new Error(err.message);
      }
    }

    try {
      if (postId && comment && comment !== '') {
        const resBody = await createComment(currUserId, reqBody);
        dispatch(addComment(resBody.commentId));
      }
    } catch (error) {
      throw new Error(error.message);
    }
    setUserQuickCount(userQuickCount + 1);
    setComment('');
  };

  return (
    <div className="mt-1 ">
      <form className="flex items-center ">
        <input
          className="inline-block mr-2 w-3/5 border rounded border-blue-400"
          type="text"
          placeholder=" Please Enter Your Comment"
          value={comment}
          onChange={handleOnChange}
        />
        <button type="button" className="inline-block ml-2" onClick={handleOnSubmit}>
          {' '}
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5334 20.123H11.4773C11.2715 20.1085 11.0755 20.015 10.9199 19.857C10.7643 19.6989 10.6578 19.4853 10.617 19.2493L9.17685 10.9818C9.1402 10.7719 9.05151 10.5793 8.92181 10.4278C8.79212 10.2763 8.62715 10.1728 8.44744 10.13L1.36845 8.44808C1.16597 8.40111 0.982478 8.27721 0.846601 8.0957C0.710723 7.91419 0.630092 7.68528 0.617282 7.44464C0.604471 7.20401 0.6602 6.96519 0.775779 6.76542C0.891358 6.56565 1.06029 6.41616 1.25623 6.34026L16.2184 0.519192C16.3864 0.438203 16.5709 0.416111 16.7494 0.455616C16.9279 0.495121 17.0927 0.594512 17.2237 0.741641C17.3546 0.888769 17.446 1.07726 17.4867 1.28408C17.5274 1.4909 17.5156 1.70708 17.4528 1.9062L12.4685 19.3803C12.4035 19.6064 12.2768 19.8013 12.108 19.9354C11.9391 20.0695 11.7373 20.1354 11.5334 20.123Z"
              fill="#5B71E5"
            />
          </svg>
          {' '}
        </button>
      </form>
    </div>
  );
}
export default QuickComment;
