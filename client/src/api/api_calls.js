/* eslint-disable consistent-return */
import axios from 'axios';

// JSON-server URL
const url = 'http://localhost:8080';

// add token to all HTTP request
const setHeaders = () => {
  axios.defaults.headers.common.Authorization = (sessionStorage.getItem('app-token') != null ? sessionStorage.getItem('app-token') : null);
};

/**
 * deletes any (expired) token and relaunch the app
 */
const reAuthenticate = () => {
  // delete the token
  sessionStorage.removeItem('app-token');
  // reload the app
  window.location.reload(true);
};

export const createLogIn = async (logInObject) => {
  try {
    const { password, userEmail } = logInObject;
    const response = await axios.post(
      `${url}/login`,
      `userEmail=${userEmail}&password=${password}`,
    );

    sessionStorage.setItem('app-token', response.data.token);
    const resp = {
      token: response.data.token,
      user: response.data.user,
    };
    return resp;
  } catch (err) {
    // console.log('err.message:', err);
    throw new Error(err.response.data.error);
  }
};

export const createUser = async (userObject) => {
  try {
    const response = await axios.post(
      `${url}/users`,
      `userEmail=${userObject.userEmail}&username=${userObject.username}&password=${userObject.password}&avatar=https://avatars.steamstatic.com/4bf1dcdd68bb15accde4d580690c27736d4872cb_full.jpg`,
    );
    return response.data;
  } catch (err) {
    return {};
  }
};

export const getUserByUserId = async (userId) => {
  setHeaders();
  if (!userId) return {};
  try {
    const response = await axios.get(`${url}/users/${userId}`);
    if (!response.data.data) {
      return {};
    }
    return response.data.data;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return {};
  }
};

export const updateUser = async (userId, userObject) => {
  setHeaders();
  if (!userId || !userObject) {
    console.log('no user id or user object');
    return {};
  }
  if (!userObject.avatar && !userObject.description) {
    console.log('no avatar or description');
    return {};
  }
  try {
    const response = await axios.patch(`${url}/users/${userId}`, userObject);
    return response.data.data;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return {};
  }
};

export const getPostsByUserId = async (userId, requestUserId) => {
  setHeaders();
  if (!userId) return [];
  try {
    const response = await axios.get(
      `${url}/users/${userId}/posts`,
      { params: { requestUserId } },
    );
    if (!response.data.data || response.data.data.length === 0) {
      return [];
    }
    return response.data.data;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return [];
  }
};

export const getPostByPostId = async (postId, requestUserId) => {
  setHeaders();
  if (!postId) {
    return {};
  }
  try {
    const response = await axios.get(`${url}/posts/${postId}`, { params: { requestUserId } });
    return response.data.data;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return {};
  }
};

export const createPost = async (postObject) => {
  setHeaders();
  if (!postObject || !postObject.userId || !postObject.postContent) return {};
  try {
    const requestBody = {
      userId: postObject.userId,
      tags: postObject.tags,
      timeStamp: postObject.timeStamp,
      postContent: postObject.postContent,
      blockList: postObject.blockList,
    };

    const response = await axios.post(`${url}/posts`, requestBody);

    return response.data.data;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return {};
  }
};

// 1: success, 0: fail
export const updatePost = async (postId, postObject) => {
  setHeaders();
  if (!postId || !postObject || !postObject.userId
    || !postObject.postContent) {
    return 0;
  }
  try {
    const requestBody = {
      id: postObject.postId,
      userId: postObject.userId,
      tags: postObject.tags,
      postContent: postObject.postContent,
      blockList: postObject.blockList,
    };
    const response = await axios.put(`${url}/posts/${postId}`, requestBody);
    if (response.status === 200) {
      return 1;
    }
    return 0;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return 0;
  }
};

// 1: success, 0: fail
export const deletePost = async (userId, postId) => {
  setHeaders();
  if (!userId || !postId) {
    return 0;
  }
  const post = await getPostByPostId(postId);
  if (!post) {
    return 0;
  }
  if (post.userId !== userId) {
    return 0;
  }
  try {
    await axios.delete(`${url}/posts/${postId}`);
    return 1;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return 0;
  }
};

export const getFollowsByFollowerId = async (followerId) => {
  setHeaders();
  if (!followerId) {
    return [];
  }
  try {
    const response = await axios.get(`${url}/follows/follower/${followerId}`);
    if (!response.data.data || response.data.data.length === 0) {
      return [];
    }
    return response.data.data;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return [];
  }
};

export const getFollowsByFolloweeId = async (followeeId) => {
  setHeaders();
  try {
    const response = await axios.get(`${url}/follows/followee/${followeeId}`);
    if (!response.data.data || response.data.data.length === 0) {
      return [];
    }
    return response.data.data;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return [];
  }
};

export const deleteFollow = async (userId, followerId, followeeId) => {
  setHeaders();
  if (!followerId || !followeeId || !userId) {
    return 0;
  }

  if (userId !== followerId) {
    return 0;
  }
  if (followerId === followeeId) {
    return 0;
  }
  try {
    const response = await axios.delete(`${url}/follows/${followerId}/${followeeId}`);
    if (response.status === 200) {
      return 1;
    }
    return 0;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return 0;
  }
};

export const addFollow = async (followObject) => {
  setHeaders();
  if (!followObject || !followObject.followerId || !followObject.followeeId) {
    return {};
  }
  try {
    const requestBody = {
      followerId: followObject.followerId,
      followeeId: followObject.followeeId,
    };
    const response = await axios.post(`${url}/follows`, requestBody);
    return response.data.data;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return {};
  }
};

export const getLikesByUserId = async (userId) => {
  setHeaders();
  if (!userId) {
    return [];
  }
  try {
    const response = await axios.get(`${url}/likes/user/${userId}`);

    return response.data.data;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return [];
  }
};

export const getLikesNumByPostId = async (postId) => {
  setHeaders();
  if (!postId) {
    return 0;
  }
  try {
    const response = await axios.get(`${url}/likes/${'post'}/${postId}`);
    return response.data.data.length;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return 0;
  }
};

export const getLikesNumByCommentId = async (commentId) => {
  setHeaders();
  if (!commentId) return 0;
  try {
    const response = await axios.get(`${url}/likes/${'comment'}/${commentId}`);
    return response.data.data.length;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return 0;
  }
};

export const getPostIsLiked = async (userId, postId) => {
  setHeaders();
  if (!userId || !postId) {
    return false;
  }
  try {
    const likes = await axios.get(`${url}/likes/isLiked/${'post'}/${userId}/${postId}`);
    if (likes.data.data.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return false;
  }
};

export const getCommentIsLiked = async (userId, commentId) => {
  setHeaders();
  if (!userId || !commentId) {
    return false;
  }
  try {
    const likes = await axios.get(`${url}/likes/isLiked/${'comment'}/${userId}/${commentId}`);
    if (likes.data.data.length === 0) {
      return false;
    }
    return true;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return false;
  }
};

export const likeComment = async (userId, likeObject) => {
  setHeaders();

  if (!likeObject || !userId || !likeObject.userId || !likeObject.commentId) {
    return 0;
  }
  if (likeObject.userId !== userId) {
    return 0;
  }
  try {
    const requestBody = {
      type: 'comment',
      userId: likeObject.userId,
      objectId: likeObject.commentId,
      timeStamp: likeObject.timeStamp,
    };
    await axios.post(`${url}/likes`, requestBody);
    return 1;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return 0;
  }
};

export const likePost = async (userId, likeObject) => {
  setHeaders();
  if (!likeObject || !likeObject.postId || !likeObject.userId) {
    return 0;
  }

  if (userId !== likeObject.userId) {
    return 0;
  }

  try {
    const requestBody = {
      type: 'post',
      userId: likeObject.userId,
      objectId: likeObject.postId,
      timeStamp: likeObject.timeStamp,
    };

    await axios.post(`${url}/likes`, requestBody);
    return 1;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return 0;
  }
};

export const unlikePost = async (userId, postId) => {
  setHeaders();
  if (!userId || !postId) {
    return 0;
  }
  try {
    const res = await axios.delete(`${url}/likes/${'post'}/${userId}/${postId}`);
    if (res.status === 200) {
      return 1;
    }
    return 0;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return 0;
  }
};

export const unlikeComment = async (userId, commentId) => {
  if (!userId || !commentId) {
    return 0;
  }

  try {
    const res = await axios.delete(`${url}/likes/${'comment'}/${userId}/${commentId}`);
    if (res.status === 200) {
      return 1;
    }
    return 0;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return 0;
  }
};

export const getCommentsByUserId = async (userId) => {
  setHeaders();
  try {
    const response = await axios.get(`${url}/comments/user/${userId}`);
    return response.data.data;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return {};
  }
};

export const getCommentsByPostId = async (postId) => {
  if (!postId) return [];
  setHeaders();

  try {
    // get comments by post id and sort by timestamp in descending order
    const res = await axios.get(`${url}/comments/post/${postId}`);
    if (res.status === 200) {
      return res.data.data;
    }
    return [];
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return [];
  }
};

export const getCommentByCommentId = async (commentId) => {
  setHeaders();
  if (!commentId) {
    return {};
  }
  try {
    const response = await axios.get(`${url}/comments/${commentId}`);
    if (response.data.data.length === 0) {
      return {};
    }
    return response.data.data[0];
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return {};
  }
};

export const createComment = async (userId, commentObject) => {
  setHeaders();

  if (!userId || !commentObject || !commentObject.userId
    || !commentObject.postId || !commentObject.content) {
    return {};
  }

  if (userId !== commentObject.userId) {
    return {};
  }

  try {
    const requestBody = {
      userId: commentObject.userId,
      postId: commentObject.postId,
      content: commentObject.content,
      timeStamp: commentObject.timeStamp,
      affiliatedComment: commentObject.affiliatedComment,
    };

    const res = await axios.post(`${url}/comments`, requestBody);
    // update comments array in comment object
    if (res.status === 201) {
      return { commentId: res.data.data.commentId };
    }
    return { commentId: undefined };
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return { commentId: undefined };
  }
};

export const updateComment = async (userId, commentObject) => {
  setHeaders();

  const {
    commentId, postId, content, timeStamp, affiliatedComment,
  } = commentObject;
  if (!commentObject || !commentObject.commentId
    || !userId || userId !== commentObject.userId) {
    return 0;
  }
  if (commentObject.userId !== userId) {
    return 0;
  }
  try {
    const requestBody = {
      commentId,
      userId,
      postId,
      content,
      timeStamp,
      affiliatedComment,
    };
    const res = await axios.put(`${url}/comments/${commentId}`, requestBody);
    if (res.status === 200) {
      return 1;
    }
    return 0;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return 0;
  }
};

export const deleteComment = async (userId, commentId) => {
  setHeaders();
  if (!userId || !commentId) {
    return 0;
  }
  const comment = await getCommentByCommentId(commentId);
  if (!comment) {
    return 0;
  }
  if (comment.userId !== userId) {
    return 0;
  }
  try {
    const response = await axios.delete(`${url}/comments/${commentId}`);
    if (response.status === 200) {
      return 1;
    }
    return 0;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return 0;
  }
};

export const getFeeds = async (userId, loadingTimes = 0) => {
  setHeaders();
  try {
    const response = await axios.get(
      `${url}/feeds/${userId}`,
      { params: { loadingTimes } },
    );
    // console.log('length', response.data.data);
    if (response.status !== 200 || !response.data.data.length) {
      return [];
    }

    return response.data.data || [];
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return [];
  }
};

export const getSuggestions = async (userId) => {
  if (!userId) {
    return [];
  }
  setHeaders();
  try {
    const response = await axios.get(`${url}/suggestions/${userId}`);
    if (!response || !response.data.data || !response.data.data.length) {
      return [];
    }
    return response.data.data;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return [];
  }
};

// this function is used to get the user's followers and following's union list
export const getFriends = async (userId) => {
  if (!userId) return [];
  setHeaders();
  try {
    const followers = await getFollowsByFolloweeId(userId);
    const followings = await getFollowsByFollowerId(userId);
    const friends = new Set();
    followers.forEach((follower) => {
      if (follower.followerId && follower.followerId !== userId) {
        friends.add(follower.followerId);
      }
    });
    followings.forEach((following) => {
      if (following.followeeId && following.followeeId !== userId) {
        friends.add(following.followeeId);
      }
    });
    return [...friends];
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return [];
  }
};

export const getmutualFriends = async (userIdOne, userIdTwo) => {
  if (!userIdOne || !userIdTwo) return [];
  setHeaders();
  try {
    const friendsOne = await getFriends(userIdOne);
    const friendsTwo = await getFriends(userIdTwo);
    const result = friendsOne.filter((friend) => friendsTwo.includes(friend));
    return result;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return [];
  }
};

export const searchUsers = async (searchString) => {
  setHeaders();
  if (!searchString) return [];
  try {
    const response = await axios.get(`${url}/search`, { params: { username: searchString } });
    if (!response || !response.data.data || !response.data.data.length) {
      return [];
    }
    return response.data.data;
  } catch (err) {
    if (err.response.status === 403) {
      reAuthenticate();
    }
    return [];
  }
};
