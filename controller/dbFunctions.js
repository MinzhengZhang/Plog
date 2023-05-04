/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const dbConfig = require('./dbConfig');

const { dbURL } = dbConfig;

let MongoConnection;
const connect = async () => {
  try {
    MongoConnection = await MongoClient.connect(
      dbURL,
      { useNewUrlParser: true, useUnifiedTopology: true },
    );
    return MongoConnection;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getDB = async () => {
  if (!MongoConnection) {
    try {
      await connect();
    } catch (err) {
      throw new Error(err.message);
    }
  }
  return MongoConnection.db();
};

const closeMongoDBConnection = async () => {
  if (MongoConnection) {
    try {
      await MongoConnection.close();
    } catch (err) {
      throw new Error(err.message);
    }
  }
};

const createUser = async (userObject) => {
  try {
    const db = await getDB();
    const result = await db.collection('users').insertOne(userObject);
    // console.log(`register result: ${JSON.stringify(result)}`);
    return result.insertedId;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateUser = async (userId, updateObject) => {
  try {
    const db = await getDB();
    const result = await db.collection('users').updateOne({ _id: ObjectId(userId) }, { $set: updateObject });
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserByEmail = async (userEmail) => {
  try {
    const db = await getDB();
    const result = await db.collection('users').findOne({ email: userEmail });// .toArray();
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

/* --------- Failed Attemps -- */
const addFailedAttempts = async (attempObject) => {
  try {
    const db = await getDB();
    const res = await db.collection('failedLogins').insertOne(attempObject);
    return res.insertedId;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getFailedAttemps = async (userEmail) => {
  try {
    const db = await getDB();
    const res = await db.collection('failedLogins').find({ userEmail }).toArray();
    return res.length;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteExpiredFails = async (userEmail) => {
  try {
    const db = await getDB();
    const expTime = new Date();
    expTime.setMinutes(expTime.getMinutes() - 15);
    const res = await db.collection('failedLogins').deleteMany({ userEmail, timeStamp: { $lt: expTime.toISOString() } });
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteAllFails = async (userEmail) => {
  try {
    const db = await getDB();
    const res = await db.collection('failedLogins').deleteMany({ userEmail });
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

// ----
const getPostById = async (postId) => {
  try {
    const db = await getDB();
    const res = await db.collection('posts').findOne({ _id: ObjectId(postId) });
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getPostsByUserId = async (userId) => {
  try {
    const db = await getDB();
    const res = await db.collection('posts').find({ userId }).toArray();
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updatePost = async (postId, postObject) => {
  try {
    const db = await getDB();
    const res = await db.collection('posts').updateOne({ _id: ObjectId(postId) }, { $set: postObject });
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const createPost = async (postObject) => {
  try {
    const db = await getDB();
    const res = await db.collection('posts').insertOne(postObject);
    return res.insertedId;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deletePost = async (postId) => {
  try {
    const db = await getDB();
    const res = await db.collection('posts').deleteOne({ _id: ObjectId(postId) });
    // console.log(`deleted post:${JSON.stringify(res)}`);
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const createUserProfile = async (userObject) => {
  try {
    const db = await getDB();
    const res = await db.collection('users').insertOne(userObject);
    return res.insertedId;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateUserProfile = async (userId, userObject) => {
  const { avatar, description } = userObject;
  try {
    const db = await getDB();
    let res;
    if (avatar) {
      res = await db.collection('users').updateOne({ _id: ObjectId(userId) }, { $set: { avatar } });
    }
    if (description) {
      res = await db.collection('users').updateOne({ _id: ObjectId(userId) }, { $set: { description } });
    }
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserByUserId = async (userId) => {
  try {
    const db = await getDB();
    const res = await db.collection('users').findOne({ _id: ObjectId(userId) });
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

//-------
const getIsFollowed = async (followerId, followeeId) => {
  try {
    const db = await getDB();
    const res = await db.collection('follows').findOne({ followerId, followeeId });
    if (res && res._id) {
      return true;
    }
    return false;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getFollowsByFollowerId = async (followerId) => {
  try {
    const db = await getDB();
    const res = await db.collection('follows').find({ followerId }).toArray();
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getFollowsByFolloweeId = async (followeeId) => {
  try {
    const db = await getDB();
    const res = await db.collection('follows').find({ followeeId }).toArray();
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

// const deleteFollow = async (followerId, followeeId) => {
//   try {
//     const db = await getDB();
//     const res = await db.collection('follows').deleteMany(
//       { followerId, followeeId },
//     );
//     return res;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

// const addFollow = async (followObject) => {
//   try {
//     const db = await getDB();
//     const requestBody = {
//       followerId: followObject.followerId,
//       followeeId: followObject.followeeId,
//       timeStamp: followObject.timeStamp,
//     };
//     const res = await db.collection('follows').insertOne(requestBody);
//     return res.insertedId;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

const deleteFollow = async (followerId, followeeId) => {
  try {
    const db = await getDB();
    const followList = await getFollowsByFolloweeId(followeeId);
    const user1 = await getUserByUserId(followerId);
    const suggestions1 = !user1.suggestions || Object.keys(user1.suggestions).length === 0
      ? {} : user1.suggestions;
    if (followList && followList.length > 0) {
      for (let i = 0; i < followList.length; i += 1) {
        const follow = followList[i];
        // eslint-disable-next-line no-await-in-loop
        const isFollowed = await getIsFollowed(followerId, follow.followerId);
        if (follow.followerId !== followerId && !isFollowed) {
          // eslint-disable-next-line no-await-in-loop
          const user2 = await getUserByUserId(follow.followerId);
          const suggestions2 = !user2.suggestions || Object.keys(user2.suggestions).length === 0
            ? {} : user2.suggestions;
          const count1 = {}.hasOwnProperty.call(suggestions1, follow.followerId)
            ? suggestions1[follow.followerId] : 0;
          const count2 = {}.hasOwnProperty.call(suggestions2, followerId)
            ? suggestions2[followerId] : 0;
          if (count1 > 0) {
            suggestions1[follow.followerId] = count1 - 1;
          }
          if (count2 > 0) {
            suggestions2[followerId] = count2 - 1;
          }
          const newUser2 = {
            userId: follow.followerId,
            suggestions: suggestions2,
          };
          // eslint-disable-next-line no-await-in-loop
          await db.collection('users').updateOne(
            { _id: ObjectId(follow.followerId) },
            { $set: newUser2 },
          );
        }
      }
      const newUser1 = {
        userId: followerId,
        suggestions: suggestions1,
      };
      await db.collection('users').updateOne(
        { _id: ObjectId(followerId) },
        { $set: newUser1 },
      );
    }
    const res = await db.collection('follows').deleteMany(
      { followerId, followeeId },
    );
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const addFollow = async (followObject) => {
  try {
    const db = await getDB();
    const requestBody = {
      followerId: followObject.followerId,
      followeeId: followObject.followeeId,
      timeStamp: followObject.timeStamp,
    };
    const followList = await getFollowsByFolloweeId(followObject.followeeId);
    const user1 = await getUserByUserId(followObject.followerId);
    const suggestions1 = !user1.suggestions || Object.keys(user1.suggestions).length === 0
      ? {} : user1.suggestions;
    if (followList && followList.length > 0) {
      for (let i = 0; i < followList.length; i += 1) {
        const follow = followList[i];
        // eslint-disable-next-line no-await-in-loop
        const isFollowed = await getIsFollowed(followObject.followerId, follow.followerId);
        if (follow.followerId !== followObject.followerId && !isFollowed) {
          // eslint-disable-next-line no-await-in-loop
          const user2 = await getUserByUserId(follow.followerId);
          const suggestions2 = !user2.suggestions || Object.keys(user2.suggestions).length === 0
            ? {} : user2.suggestions;
          const count1 = {}.hasOwnProperty.call(suggestions1, follow.followerId)
            ? suggestions1[follow.followerId] : 0;
          const count2 = {}.hasOwnProperty.call(suggestions2, followObject.followerId)
            ? suggestions2[followObject.followerId] : 0;
          suggestions1[follow.followerId] = count1 + 1;
          suggestions2[followObject.followerId] = count2 + 1;
          const newUser2 = {
            userId: follow.followerId,
            suggestions: suggestions2,
          };
          // eslint-disable-next-line no-await-in-loop
          await db.collection('users').updateOne(
            { _id: ObjectId(follow.followerId) },
            { $set: newUser2 },
          );
        }
      }
      const newUser1 = {
        userId: followObject.followerId,
        suggestions: suggestions1,
      };
      await db.collection('users').updateOne(
        { _id: ObjectId(followObject.followerId) },
        { $set: newUser1 },
      );
    }
    const res = await db.collection('follows').insertOne(requestBody);
    return res.insertedId;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getLikesByUserId = async (userId) => {
  try {
    const db = await getDB();
    const res = await db.collection('likes').find({ userId, type: 'post' }).toArray();
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getLikes = async (type, objectId) => {
  try {
    const db = await getDB();
    const res = await db.collection('likes').find({ objectId, type }).toArray();
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getIsLiked = async (type, userId, objectId) => {
  try {
    const db = await getDB();
    const likes = await db.collection('likes').find({ type, userId, objectId }).toArray();
    return likes;
  } catch (err) {
    throw new Error(err.message);
  }
};

const addLike = async (likeObject) => {
  try {
    const db = await getDB();
    const requestBody = {
      type: likeObject.type,
      userId: likeObject.userId,
      objectId: likeObject.objectId,
      timeStamp: likeObject.timeStamp,
    };
    const res = await db.collection('likes').insertOne(requestBody);
    return res.insertedId;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteLike = async (type, userId, objectId) => {
  try {
    const db = await getDB();
    const res = await db.collection('likes').deleteMany({ type, userId, objectId });
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getCommentsByUserId = async (userId) => {
  try {
    const db = await getDB();
    const res = await db.collection('comments').find({ userId }).toArray();
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getCommentsByPostId = async (postId) => {
  try {
    const db = await getDB();
    const res = await db.collection('comments').find({ postId }).sort({ timeStamp: -1 }).toArray();
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getCommentByCommentId = async (commentId) => {
  try {
    const db = await getDB();
    const res = await db.collection('comments').find({ _id: ObjectId(commentId) }).toArray();
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const createComment = async (commentObject) => {
  try {
    const db = await getDB();
    const res = await db.collection('comments').insertOne(commentObject);
    // update comments array in comment object
    return res.insertedId;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateComment = async (commentId, commentObject) => {
  if (!commentId) {
    return null;
  }
  try {
    const db = await getDB();
    const res = await db.collection('comments').updateOne(
      { _id: ObjectId(commentId) },
      { $set: commentObject },
    );
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteComment = async (commentId) => {
  try {
    const db = await getDB();
    const res = await db.collection('comments').deleteOne({ _id: ObjectId(commentId) });
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getFeeds = async (userId, page) => {
  const PAGESIZE = 10;
  const skip = (page) * PAGESIZE;
  try {
    const db = await getDB();
    const following = await db.collection('follows').find({ followerId: userId }).project({ followeeId: 1, _id: 0 }).toArray();
    if (following.length === 0) {
      return [];
    }
    const followingIds = following.map((follow) => follow.followeeId);
    const result = db.collection('posts').find({ userId: { $in: followingIds }, blockList: { $nin: [userId] } }).sort({ timeStamp: -1 }).skip(skip)
      .limit(PAGESIZE)
      .toArray();
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

// const getSuggestions = async (userId) => {
//   try {
//     const db = await getDB();
//     const iFollow = await db.collection('follows').find({ followerId: userId }).toArray();
//     const promises = [];
//     const target = 5;
//     let suggestedUsers;
//     const suggestedIds = [];
//     const allUsers = await db.collection('users').find().toArray();

//     // my followers also follow
//     if (!iFollow || iFollow.length === 0) {
//       suggestedUsers = [];
//     } else {
//       // for each person i follow, also get their follows
//       for (let i = 0; i < iFollow.length; i += 1) {
//         // eslint-disable-next-line no-await-in-loop
//         const theyFollow = await db.collection('follows').find({ followerId: iFollow[i].followeeId }).toArray();
//         if (theyFollow && theyFollow.length > 0) {
//           for (let j = 0; j < theyFollow.length; j += 1) {
//             const currSuggestId = theyFollow[j].followeeId;
//             const isFollowed = iFollow.findIndex((x) => x.followeeId === currSuggestId);
//             const isSuggested = suggestedIds.indexOf(currSuggestId);
//             const exists = allUsers.findIndex((x) => x._id.toString() === currSuggestId);
//             if (currSuggestId !== userId && isFollowed === -1
//               && isSuggested === -1 && exists !== -1) {
//               promises.push(db.collection('users').findOne({ _id: ObjectId(currSuggestId) }));
//               suggestedIds.push(currSuggestId);
//               if (suggestedIds.length > target) break;
//             }
//           }
//           if (suggestedIds.length > target) break;
//         }
//       }
//     }
//     suggestedUsers = await Promise.all(promises);
//     // if not enough suggestions, recommend the first users in DB
//     if (suggestedUsers !== undefined && suggestedUsers.length >= target) {
//       return suggestedUsers;
//     }
//     if (!allUsers || allUsers.length === 0) return [];

//     for (let k = 0; k < allUsers.length; k += 1) {
//       const currSuggestId = allUsers[k]._id.toString();
//       const isFollowed = iFollow.findIndex((x) => x.followeeId === currSuggestId);
//       const isSuggested = suggestedIds.indexOf(currSuggestId);
//       const exists = allUsers.findIndex((x) => x._id.toString() === currSuggestId);
//       if (currSuggestId !== userId && isFollowed === -1
//         && isSuggested === -1 && exists !== -1) {
//         suggestedUsers.push(allUsers[k]);
//       }
//       if (suggestedUsers.length >= target) break;
//     }
//     return suggestedUsers;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// };

const getSuggestions = async (userId) => {
  try {
    const db = await getDB();
    const suggestedUsers = [];
    const user = await getUserByUserId(userId);
    if (user.suggestions && Object.keys(user.suggestions).length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in user.suggestions) {
        if ({}.hasOwnProperty.call(user.suggestions, key)) {
          if (user.suggestions[key] >= 3) {
            // eslint-disable-next-line no-await-in-loop
            const sUser = await db.collection('users').findOne({ _id: ObjectId(key) });
            suggestedUsers.push(sUser);
          }
        }
      }
    }
    return suggestedUsers;
  } catch (err) {
    throw new Error(err.message);
  }
};

const searchUser = async (query) => {
  try {
    const db = await getDB();
    const res = await db.collection('users').find({ username: query }).toArray();
    return res;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  connect,
  getDB,
  closeMongoDBConnection,
  getUserByEmail,
  getUserByUserId,
  createUser,
  createUserProfile,
  updateUserProfile,
  getPostById,
  getPostsByUserId,
  updatePost,
  createPost,
  deletePost,
  getIsFollowed,
  getFollowsByFollowerId,
  getFollowsByFolloweeId,
  deleteFollow,
  addFollow,
  getLikesByUserId,
  getLikes,
  getIsLiked,
  addLike,
  deleteLike,
  getCommentsByUserId,
  getCommentsByPostId,
  getCommentByCommentId,
  createComment,
  updateComment,
  deleteComment,
  getFeeds,
  getSuggestions,
  updateUser,
  addFailedAttempts,
  deleteExpiredFails,
  getFailedAttemps,
  deleteAllFails,
  searchUser,
};

// const main = async () => {
//   await connect();
//   console.log('connected');
//   await createPost({
//     username: 'sda', userId: 'sda', caption: 'sda', image: 'sda', timeStamp: 'sda',
//   });
// };
// main();
