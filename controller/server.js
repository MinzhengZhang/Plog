/* eslint-disable no-continue */
/* eslint-disable no-underscore-dangle */
// curl login
//  curl -X POST http://localhost:8080/login -H "Content-Type: application/json" -d {"username":"admin","password":"admin"} //localhost:3000/login
const { ObjectId } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser'); // enable parsing nested object

const jsonParser = bodyParser.json();

const webapp = express();

const cors = require('cors');
const jwt = require('jsonwebtoken');

const secret = '$trong&_$ecret_p@ssword';
webapp.use(cors());

webapp.use(express.urlencoded({ extended: true }));
webapp.use(jsonParser);
// webapp.use(express.json());
const dbLib = require('./dbFunctions');

webapp.get('/', (req, resp) => {
  resp.json({ message: 'Plog backend' });
});

// POST /users endpoint for registering a user
webapp.post('/users', async (req, res) => {
  // if (await auth.authenticateUser(req.headers.authorization, secret)) {
  if (!req.body.username
     || !req.body.userEmail
     || !req.body.password
     || req.body.username === 'undefined'
     || req.body.userEmail === 'undefined'
     || req.body.password === 'undefined') {
    res.status(404).json({ message: 'missing username, email, or password' });
    return;
  }
  try {
    const userObject = {
      email: req.body.userEmail,
      username: req.body.username,
      password: req.body.password,
      avatar: req.body.avatar || 'https://avatars.steamstatic.com/4bf1dcdd68bb15accde4d580690c27736d4872cb_full.jpg',
    };

    // console.log(userObject);
    const result = await dbLib.createUser(userObject);

    res.status(201).json({ data: { userId: result, ...userObject } });
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
  // }
});

/**
 * log in endpoint  */
webapp.post('/login', async (req, res) => {
  if (!req.body.userEmail || req.body.userEmail === 'undefined') {
    res.status(401).json({ error: 'missing email' });
    res.end();
    return;
  }
  if (!req.body.password || req.body.password === '') {
    res.status(401).json({ error: 'missing password' });
    res.end();
    return;
  }
  // sign the token and send back to frontend
  try {
    // check failed log in attempts
    await dbLib.deleteExpiredFails(req.body.userEmail);
    const nFails = await dbLib.getFailedAttemps(req.body.userEmail);
    if (nFails >= 3) {
      res.status(401).json({ error: 'Account locked out for 15 minutes after three failed attempts' });
      res.end();
      return;
    }

    // sign the token and send back to frontend
    const user = await dbLib.getUserByEmail(req.body.userEmail);
    const timeStamp = new Date().toISOString();
    if (!user || user.password !== req.body.password) {
      dbLib.addFailedAttempts({ userEmail: req.body.userEmail, timeStamp });
      res.status(401).json({ error: 'User does not exist or incorrect password' });
      return;
    }
    const jwtoken = jwt.sign({
      id: user._id, userEmail: req.body.userEmail, username: user.username, avatar: user.avatar,
    }, secret, { expiresIn: '7200s' });
    user.userId = user._id;
    user.id = user._id;
    dbLib.deleteAllFails(req.body.userEmail);
    res.status(201).json({ token: jwtoken, user });
  } catch (err) {
    res.status(401).json({ error: 'there was an error' });
  }
});

// user profile update
webapp.patch('/users/:userId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { userId } = req.params;
  if (!userId || !ObjectId.isValid(userId)) {
    console.log('Bad request userId', userId);
    res.status(404).json({ error: 'Bad request' });
    return;
  }
  const { avatar, description } = req.body;
  if (!avatar && !description) {
    console.log('Bad request avatar');
    res.status(404).json({ error: 'Bad request' });
    return;
  }
  const user = await dbLib.getUserByUserId(userId);
  if (!user || !user._id) {
    res.status(404).json({ error: 'Bad request' });
    return;
  }
  try {
    let result;
    if (avatar) {
      result = await dbLib.updateUser(userId, { avatar });
    } else if (description) {
      result = await dbLib.updateUser(userId, { description });
    }
    if (!result) {
      res.status(404).json({ error: 'update Failed' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

//------
webapp.get('/posts/:postId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  // if (await auth.authenticateUser(req.headers.authorization, secret)) {
  const { postId } = req.params;
  const { requestUserId } = req.query; // this is not necessary required
  if (!postId || postId === 'undefined' || !ObjectId.isValid(postId)) {
    res.status(404).json({ error: 'Bad request' });
    return;
  }

  try {
    const post = await dbLib.getPostById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    // this is for blocking all users except the owner
    if (post.blockList && post.blockList.includes('*')) {
      if (requestUserId !== post.userId) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }
    }
    if (requestUserId && post.blockList && post.blockList.includes(requestUserId)) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const result = {
      postId: post._id,
      userId: post.userId,
      tags: post.tags,
      postContent: post.postContent,
      timeStamp: post.timeStamp,
    };
    if (post.userId === requestUserId) {
      result.blockList = post.blockList;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

webapp.delete('/posts/:postId', async (req, res) => {
  // if (await auth.authenticateUser(req.headers.authorization, secret)) {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { postId } = req.params;
  if (!postId || !ObjectId.isValid(postId)) {
    res.status(404).json({ error: 'Bad request' });
    return;
  }
  try {
    const result = await dbLib.deletePost(postId);
    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
  // }
  // res.status(401).json({ message: 'Unauthorized' });
});

webapp.post('/posts', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  // if (await auth.authenticateUser(req.headers.authorization, secret)) {
  const {
    userId, postContent, tags, blockList,
  } = req.body;
  if (!userId || !postContent || !ObjectId.isValid(userId) || !postContent.title) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  postContent.title = postContent.title.trim();
  if (postContent.title.length === 0) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    const postBody = {
      userId,
      postContent,
      timeStamp: new Date().getTime(),
      tags: tags || [],
      blockList: blockList || [],
    };
    const result = await dbLib.createPost(postBody);
    res.status(200).json({ data: { postId: result, ...postBody } });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
  // }
});

webapp.put('/posts/:id', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  // if (await auth.authenticateUser(req.headers.authorization, secret)) {
  const postId = req.params.id;
  const { userId, postContent } = req.body;
  if (!postId || !userId || !postContent
    || !ObjectId.isValid(postId)
    || !ObjectId.isValid(userId)
    || !postContent.title) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  postContent.title = postContent.title.trim();
  if (postContent.title.length === 0) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    const postBody = {
      userId,
      postContent,
      timeStamp: new Date().getTime(),
      tags: req.body.tags || [],
      blockList: req.body.blockList || [],
    };
    const result = await dbLib.updatePost(postId, postBody);
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(500).json({ message: 'server error' });
  }
  // }
});

webapp.get('/users/:id/posts', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  // if (await auth.authenticateUser(req.headers.authorization, secret)) {
  const userId = req.params.id;
  if (!userId || userId === 'undefined' || !ObjectId.isValid(userId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  const requestUser = req.query.requestUserId;

  try {
    const user = await dbLib.getUserByUserId(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const result = await dbLib.getPostsByUserId(userId);
    if (!result) {
      res.status(404).json({ message: 'Posts not found' });
      return;
    }
    const posts = [];
    for (let i = 0; i < result.length; i += 1) {
      const post = result[i];
      post.postId = post._id;
      if (post.blockList && post.blockList.includes('*') && requestUser !== userId) {
        continue;
      }
      if (post.blockList && post.blockList.includes(requestUser)) {
        continue;
      }
      posts.push({
        postId: post._id,
        userId: post.userId,
        tags: post.tags,
        postContent: post.postContent,
        timeStamp: post.timeStamp,
      });
    }

    res.status(200).json({ data: posts });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
  // }
});

webapp.get('/users/:id', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  // if (await auth.authenticateUser(req.headers.authorization, secret)) {
  const userId = req.params.id;

  if (!userId || userId === 'undefined' || !ObjectId.isValid(userId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    const user = await dbLib.getUserByUserId(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const returnUser = {
      userId: user._id, username: user.username, avatar: user.avatar, description: user.description || '',
    };
    console.log('returnUser: ', returnUser);
    res.status(200).json({ data: returnUser });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

webapp.get('/follows/follower/:followerId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { followerId } = req.params;
  if (!followerId || followerId === 'undefined' || !ObjectId.isValid(followerId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    // get the data from the db
    const results = await dbLib.getFollowsByFollowerId(followerId);

    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/follows/followee/:followeeId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { followeeId } = req.params;
  if (!followeeId || followeeId === 'undefined' || !ObjectId.isValid(followeeId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    // get the data from the db
    const results = await dbLib.getFollowsByFolloweeId(req.params.followeeId);
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.delete('/follows/:followerId/:followeeId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { followerId, followeeId } = req.params;
  if (!followerId || followerId === 'undefined' || !ObjectId.isValid(followerId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  if (!followeeId || followeeId === 'undefined' || !ObjectId.isValid(followeeId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  if (followerId === followeeId) {
    res.status(400).json({ message: 'Bad request: Users can not follow and unfollow themselves' });
    return;
  }

  try {
    // get the data from the db
    const results = await
    dbLib.deleteFollow(req.params.followerId, req.params.followeeId);
    // send the response with the appropriate status code
    res.status(200).json({ message: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.post('/follows/', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { followerId, followeeId } = req.body;
  if (!followerId || !followeeId
    || !ObjectId.isValid(followerId)
    || !ObjectId.isValid(followeeId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  if (followerId === followeeId) {
    res.status(400).json({ message: 'Bad request: Users can not follows themselves' });
    return;
  }
  try {
    const follower = await dbLib.getUserByUserId(followerId);
    const followee = await dbLib.getUserByUserId(followeeId);
    if (!follower || !follower._id || !followee || !followee._id) {
      res.status(404).json({ message: 'Bad request: Users not found' });
      return;
    }

    const isFollowed = await dbLib.getIsFollowed(followerId, followeeId);
    if (isFollowed) {
      res.status(409).json({ message: 'Bad request: Users already followed' });
      return;
    }
    const newFollow = {
      followerId: req.body.followerId,
      followeeId: req.body.followeeId,
      timeStamp: new Date().getTime(),
    };

    const result = await dbLib.addFollow(newFollow);
    // send the response with the appropriate status code
    res.status(201).json({ data: { _id: result, ...newFollow } });
  } catch (err) {
    res.status(409).json({ message: 'there was error' });
  }
});

webapp.get('/likes/user/:userId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { userId } = req.params;
  if (!userId || userId === 'undefined' || !ObjectId.isValid(userId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    // get the data from the db
    const results = await dbLib.getLikesByUserId(userId);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/likes/:type/:objectId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { type, objectId } = req.params;
  if (!type || (type !== 'post' && type !== 'comment') || !objectId || objectId === 'undefined' || !ObjectId.isValid(objectId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    // get the data from the db
    const results = await dbLib.getLikes(req.params.type, req.params.objectId);

    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/likes/isLiked/:type/:userId/:objectId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { type, userId, objectId } = req.params;
  if (!type || (type !== 'post' && type !== 'comment') || !userId || !ObjectId.isValid(userId)
   || !objectId || !ObjectId.isValid(objectId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    // get the data from the db
    const results = await dbLib.getIsLiked(req.params.type, req.params.userId, req.params.objectId);
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.post('/likes', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const {
    type, userId, objectId,
  } = req.body;
  if (!type || (type !== 'post' && type !== 'comment')
  || !userId || !ObjectId.isValid(userId) || !objectId || !ObjectId.isValid(objectId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    // create the new student
    const isLiked = await dbLib.getIsLiked(type, userId, objectId);
    if (isLiked && isLiked._id) {
      res.status(409).json({ message: 'Bad request: User already liked' });
      return;
    }
    const newLike = {
      type,
      userId,
      objectId,
      timeStamp: new Date().getTime(),
    };
    const result = await dbLib.addLike(newLike);
    // send the response with the appropriate status code
    res.status(201).json({ data: { id: result, ...newLike } });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
});

webapp.delete('/likes/:type/:userId/:objectId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { type, userId, objectId } = req.params;
  if (!type || (type !== 'post' && type !== 'comment') || !userId || !ObjectId.isValid(userId)
    || !objectId || !ObjectId.isValid(objectId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    // get the data from the db
    const results = await
    dbLib.deleteLike(req.params.type, req.params.userId, req.params.objectId);
    // send the response with the appropriate status code
    res.status(200).json({ message: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/comments/user/:userId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { userId } = req.params;
  if (!userId || userId === 'undefined' || !ObjectId.isValid(userId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    // get the data from the db
    const results = await dbLib.getCommentsByUserId(req.params.userId);
    // send the response with the appropriate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/comments/post/:postId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { postId } = req.params;
  if (!postId || !ObjectId.isValid(postId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    // get the data from the db
    const results = await dbLib.getCommentsByPostId(req.params.postId);
    const comments = results.map((comment) => ({
      commentId: comment._id,
      ...comment,
    }));
    // send the response with the appropriate status code
    res.status(200).json({ data: comments });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

webapp.get('/comments/:commentId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { commentId } = req.params;
  if (!commentId || !ObjectId.isValid(commentId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    // get the data from the db
    const results = await dbLib.getCommentByCommentId(req.params.commentId);
    const comments = results.map(
      (comment) => ({
        commentId: comment._id,
        ...comment,
      }),
    );
    // send the response with the appropriate status code
    res.status(200).json({ data: comments });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.post('/comments', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  if (!req.body.userId || !ObjectId.isValid(req.body.userId)
    || !req.body.postId || !ObjectId.isValid(req.body.userId)
    || !req.body.content) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    const newComment = {
      userId: req.body.userId,
      postId: req.body.postId,
      content: req.body.content,
      timeStamp: new Date().getTime(),
      affiliatedComment: req.body.affiliatedComment, // this field can be undifined or null
    };
    const user = await dbLib.getUserByUserId(req.body.userId);
    const post = await dbLib.getPostById(req.body.postId);
    if (!user || !post) {
      res.status(404).json({ message: 'does not exist post or user' });
      return;
    }
    const result = await dbLib.createComment(newComment);
    if (result) {
      res.status(201).json({ data: { _id: result, commentId: result, ...newComment } });
      return;
    }
    res.status(400).json({ message: 'there was error' });
    return;
  } catch (err) {
    res.status(409).json({ message: 'there was error' });
  }
});

webapp.put('/comments/:id', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { id } = req.params;
  const {
    commentId, userId, postId, content, timeStamp, affiliatedComment,
  } = req.body;
  if (!commentId || !userId || !postId || !content) {
    res.status(400).json({ message: 'Bad request:missing some aruments' });
    return;
  }

  if (!ObjectId.isValid(commentId) || !ObjectId.isValid(userId) || !ObjectId.isValid(postId)) {
    res.status(400).json({ message: 'Bad request:invalid id' });
    return;
  }
  if (id !== commentId) {
    res.status(400).json({ message: 'Bad request:invalid id' });
    return;
  }

  try {
    // create the new student
    const user = await dbLib.getUserByUserId(req.body.userId);
    const post = await dbLib.getPostById(req.body.postId);

    if (!user || !post) {
      res.status(404).json({ message: 'does not exist post or user' });
      return;
    }

    const newComment = {
      userId,
      postId,
      content,
      timeStamp: new Date().getTime(),
      affiliatedComment,
    };

    const result = await dbLib.updateComment(commentId, newComment);
    if (!result) {
      res.status(404).json({ message: 'there was error' });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.delete('/comments/:commentId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  const { commentId } = req.params;
  if (!commentId || !ObjectId.isValid(commentId)) {
    res.status(400).json({ message: 'Bad request' });
    return;
  }
  try {
    const results = await dbLib.deleteComment(req.params.commentId);
    res.status(200).json({ message: results });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

// webapp.get('/feeds/:userId', async (req, res) => {
//   if (!req.params.userId) {
//     res.status(400).json({ message: 'bad request: missing userId or invalid userId' });
//     return;
//   }
//   try {
//     // check user first, if user does not exist, return 404
//     const user = await dbLib.getUserByUserId(req.params.userId);
//     if (!user) {
//       res.status(404).json({ message: 'bad request: param userId not in database' });
//       return;
//     }

//     const results = await dbLib.getFeeds(req.params.userId);
//     const feeds = results.map((result) => ({
//       postId: result._id,
//       userId: result.userId,
//       postContent: result.postContent,
//       tags: result.tags,
//       timeStamp: result.timeStamp,
//     }));
//     res.status(200).json({ data: feeds });
//   } catch (err) {
//     res.status(404).json({ message: 'there was error' });
//   }
// });
webapp.get('/feeds/:userId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  if (!req.params.userId) {
    res.status(400).json({ message: 'bad request: missing userId or invalid userId' });
    return;
  }
  let { loadingTimes } = req.query;
  if (!loadingTimes) {
    loadingTimes = 0;
  }
  try {
    // check user first, if user does not exist, return 404
    const user = await dbLib.getUserByUserId(req.params.userId);
    if (!user) {
      res.status(404).json({ message: 'bad request: param userId not in database' });
      return;
    }

    const results = await dbLib.getFeeds(req.params.userId, loadingTimes);
    const feeds = results.map(({
      _id, userId, tags, postContent, timeStamp,
    }) => ({
      postId: _id, userId, tags, postContent, timeStamp,
    }));

    res.status(200).json({ data: feeds });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

webapp.get('/suggestions/:userId', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }
  if (!req.params.userId || !ObjectId.isValid(req.params.userId)) {
    res.status(400).json({ message: 'bad request: missing userId or Invalid userId' });
    return;
  }
  try {
    // check user first, if user does not exist, return 404
    const user = await dbLib.getUserByUserId(req.params.userId);
    if (!user) {
      res.status(404).json({ message: 'bad request: param userId not in database' });
      return;
    }
    const results = await dbLib.getSuggestions(req.params.userId);
    if (!results) {
      res.status(404).json({ message: 'can not find suggestions' });
      return;
    }
    let suggestions = [];
    if (results && results.length > 0) {
      suggestions = results.map((result) => ({
        userId: result._id,
        username: result.username,
        avatar: result.avatar,
      }));
    }
    res.status(200).json({ data: suggestions });
  } catch (err) {
    res.status(404).json({ message: 'there was error' });
  }
});

webapp.get('/search', async (req, res) => {
  try {
    jwt.verify(req.headers.authorization, secret);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.status(403).json({ error: 'TokenExpiredError' });
      return;
    }
  }

  const { username } = req.query;

  if (!username) {
    res.status(200).json({ data: [] });
    return;
  }
  try {
    const results = await dbLib.searchUser(username);
    const users = results.map((result) => ({
      userId: result._id,
      username: result.username,
      avatar: result.avatar,
    }));
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

webapp.use((req, res) => {
  res.status(404).json({ error: 'invalid endpoint' });
});

module.exports = webapp;
