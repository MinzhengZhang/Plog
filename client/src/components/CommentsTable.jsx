/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
// here commentsIds refers to ids of comments
import { useSelector, useDispatch } from 'react-redux';
import { MentionsInput, Mention } from 'react-mentions';

import Comment from './Comment';
import { createComment, getFollowsByFollowerId, getUserByUserId } from '../api/api_calls';
import { addComment, loadComments } from '../redux/actions/appActions';

// affiliatedId can be undefined, here is refer to the affiliation of the comment
function CommentsTable({
  currUserId, commentsIds, postId, affiliatedComment,
}) {
  const comments = useSelector((state) => state.comments);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadComments(commentsIds));
    // eslint-disable-next-line
  }, [commentsIds]);

  let commentComponents = [];
  if (comments && comments.length > 0) {
    commentComponents = comments.map((commentId) => (
      <Comment
        currUserId={currUserId}
        commentId={commentId}
        key={commentId}
      />
    ));
  }

  return (
    <div className="min-w-64">
      <h1 className="text-2xl font-bold mb-4">Comments</h1>
      {commentComponents}
      {/* appendComment={appendComment} */}
      <CommentCreation
        currUserId={currUserId}
        postId={postId}
        affiliatedComment={affiliatedComment}
      />
    </div>
  );
}

export function CommentCreation({
  currUserId, postId, affiliatedComment,
}) {
  const dispatch = useDispatch();
  const [commentsContent, setCommentsContent] = useState('');
  const handleOnChange = (e) => {
    const content = e.target.value;
    setCommentsContent(content);
  };

  const appendComment = (appendedCommentId) => {
    dispatch(addComment(appendedCommentId));
  };

  const handleOnClick = async () => {
    const contentText = commentsContent;
    const contentText1 = contentText.split('@@@__').join("<a href='/profile/");
    const contentText2 = contentText1.split('^^^__').join("'>");
    const contentText3 = contentText2.split('@@@^^^').join('</a>');

    const reqBody = {
      postId,
      userId: currUserId,
      content: contentText3,
      timeStamp: new Date().getTime(),
      affiliatedComment,
    };
    let newCommentRes;
    if (contentText3 && contentText3 !== '') {
      newCommentRes = await createComment(currUserId, reqBody);
    }
    if (newCommentRes && newCommentRes.commentId) {
      const { commentId } = newCommentRes;
      setCommentsContent('');
      appendComment(commentId);
    }
  };
  const [allUsers, setAllUsers] = useState([]);
  const firstRendering = useRef(true);

  useEffect(() => {
    async function fetchData() {
      const result = await getFollowsByFollowerId(currUserId);
      const following = [];
      result.forEach((follow) => {
        const { followeeId } = follow;
        const followee = getUserByUserId(followeeId);
        following.push(followee);
      });
      const followingUsers = await Promise.all(following);

      setAllUsers(followingUsers);
    }
    if (firstRendering.current) {
      firstRendering.current = false;
      fetchData();
    }
  });

  const users = [];
  allUsers.map((user) => users.push({ id: user.userId, display: user.username }));

  return (
    <div className="max-w-lg shadow-md w-full">
      <form action="" className="w-full p-4">
        <label className="block mb-2" htmlFor="comment">
          <span className="text-gray-600">Add a comment</span>
          <MentionsInput
            className="block w-full mt-1 rounded"
            id="comment"
            rows="3"
            onChange={handleOnChange}
            value={commentsContent}
          >
            <Mention
              trigger="@"
              data={users}
              markup="@@@____id__^^^____display__@@@^^^"
            />
          </MentionsInput>
        </label>

        <button type="button" className="px-3 py-2 text-sm text-blue-100 bg-blue-600 rounded" onClick={handleOnClick}>Comment</button>
      </form>

    </div>
  );
}

export default CommentsTable;
