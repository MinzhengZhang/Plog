// isLogin
export const login = (user) => ({
  type: 'LOGIN',
  user,
});

export const logout = () => ({
  type: 'LOGOUT',
});

export const updateAvatar = (avatar) => ({
  type: 'UPDATE_AVATAR',
  avatar,
});
// userId
// likes post
export const likesPost = (post) => ({
  type: 'LIKES_POST',
  post,
});
// unlikes post
export const unlikesPost = (post) => ({
  type: 'UNLIKES_POST',
  post,
});

export const likesComment = (comment) => ({
  type: 'LIKES_COMMENT',
  comment,
});
  // unlikes post
export const unlikesComment = (comment) => ({
  type: 'UNLIKES_COMMENT',
  comment,
});
// following
export const follow = (userId) => ({
  type: 'FOLLOW_USER',
  userId,
});

// unfollowing
export const unfollow = (userId) => ({
  type: 'UNFOLLOW_USER',
  userId,
});

// my post
export const addPost = (post) => ({
  type: 'ADD_POST',
  post,
});

// deletePost
export const deletePost = (post) => ({
  type: 'DELETE_POST',
  post,
});

export const addComment = (commentId) => ({
  type: 'ADD_COMMENT',
  commentId,
});

export const deleteComment = (commentId) => ({
  type: 'DELETE_COMMENT',
  commentId,
});

export const editComment = (commentId) => ({
  type: 'EDIT_COMMENT',
  commentId,
});

export const loadComments = (commentsIds) => ({
  type: 'LOAD_COMMENTS',
  commentsIds,
});
