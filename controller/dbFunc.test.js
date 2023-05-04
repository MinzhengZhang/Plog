/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
const request = require('supertest');
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('./dbFunctions');
const webapp = require('./server');

let mongo;

describe('GET follow(s) endpoint integration test', () => {
  /**
   * If you get an error with afterEach
   * inside .eslintrc.json in the
   * "env" key add -'jest': true-
  */
  let db;
  let testUser1;
  let testUser2;
  let testFollowID;
  // test resource to create / expected response
  /**
       * Make sure that the data is in the DB before running
       * any test
       * connect to the DB
       */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res1 = await request(webapp).post('/users/').send('username=kevin&userEmail=a@b.com&password=123');
    testUser1 = JSON.parse(res1.text).data._id;
    const res2 = await request(webapp).post('/users/').send('username=silvia&userEmail=c@d.com&password=123');
    testUser2 = JSON.parse(res2.text).data._id;
    const res3 = await request(webapp).post('/follows/')
      .send(`followerId=${testUser1}&followeeId=${testUser2}&timeStamp=1234`);
      // eslint-disable-next-line no-underscore-dangle
    testFollowID = JSON.parse(res3.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result1 = await db.collection('users').deleteMany({ _id: ObjectId(testUser1) });
      const result2 = await db.collection('users').deleteMany({ _id: ObjectId(testUser2) });
      const result3 = await db.collection('follows').deleteMany({ _id: ObjectId(testFollowID) });
      console.log('info', result1, result2, result3);
    } catch (err) {
      console.log('error', err.message);
    }
  };
    /**
   * Delete all test data from the DB
   * Close all open connections
   */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Get follows by followerId', async () => {
    const resp = await request(webapp).get(`/follows/follower/${testUser1}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const followArr = JSON.parse(resp.text).data;
    expect(followArr[0].followerId).toEqual(testUser1);
  });

  test('Get follows by followeeId', async () => {
    const resp = await request(webapp).get(`/follows/followee/${testUser2}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const followArr = JSON.parse(resp.text).data;
    expect(followArr[0].followeeId).toEqual(testUser2);
  });
});

describe('Delete follow(s) endpoint integration test', () => {
  /**
     * If you get an error with afterEach
     * inside .eslintrc.json in the
     * "env" key add -'jest': true-
  // test resource to create / expected response
  /**
       * Make sure that the data is in the DB before running
       * any test
       * connect to the DB
       */
  let db;
  let testUser1;
  let testUser2;
  let testFollowID;
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res1 = await request(webapp).post('/users/').send('username=kevin&userEmail=a@b.com&password=123');
    testUser1 = JSON.parse(res1.text).data._id;
    const res2 = await request(webapp).post('/users/').send('username=silvia&userEmail=c@d.com&password=123');
    testUser2 = JSON.parse(res2.text).data._id;
    const res3 = await request(webapp).post('/follows/')
      .send(`followerId=${testUser1}&followeeId=${testUser2}&timeStamp=1234`);
      // eslint-disable-next-line no-underscore-dangle
    testFollowID = JSON.parse(res3.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result1 = await db.collection('users').deleteMany({ _id: ObjectId(testUser1) });
      const result2 = await db.collection('users').deleteMany({ _id: ObjectId(testUser2) });
      const result3 = await db.collection('follows').deleteMany({ _id: ObjectId(testFollowID) });
      console.log('info', result1, result2, result3);
    } catch (err) {
      console.log('error', err.message);
    }
  };
    /**
   * Delete all test data from the DB
   * Close all open connections
   */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('delete follow', async () => {
    const resp = await request(webapp).delete(`/follows/${testUser1}/${testUser2}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const resp1 = await db.collection('follows').findOne({ _id: ObjectId(testFollowID) });
    expect(resp1).toBeNull();
  });
});

describe('GET likes endpoint integration test', () => {
  /**
     * If you get an error with afterEach
     * inside .eslintrc.json in the
     * "env" key add -'jest': true-
    */
  let db;
  let testLikeID;
  let testUser1;
  let testUser2;
  let testPost;
  // test resource to create / expected response
  /**
         * Make sure that the data is in the DB before running
         * any test
         * connect to the DB
         */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res1 = await request(webapp).post('/users/').send('username=kevin&userEmail=a@b.com&password=123');
    testUser1 = JSON.parse(res1.text).data.userId;
    const res2 = await request(webapp).post('/users/').send('username=silvia&userEmail=c@d.com&password=123');
    testUser2 = JSON.parse(res2.text).data.userId;
    const res3 = await request(webapp).post('/posts/')
      .send({
        userId: testUser2, postContent: { title: 'hi' }, timeStamp: '1234', tags: 'sports',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    testPost = JSON.parse(res3.text).data.postId;
    const res4 = await request(webapp).post('/likes/')
      .send(`type=post&userId=${testUser1}&objectId=${testPost}&timeStamp=1234`);
    // eslint-disable-next-line no-underscore-dangle
    testLikeID = JSON.parse(res4.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result1 = await db.collection('users').deleteMany({ _id: ObjectId(testUser1) });
      const result2 = await db.collection('users').deleteMany({ _id: ObjectId(testUser2) });
      const result3 = await db.collection('posts').deleteMany({ _id: ObjectId(testPost) });
      const result4 = await db.collection('likes').deleteMany({ _id: ObjectId(testLikeID) });
      console.log('info', result1, result2, result3, result4);
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
     * Delete all test data from the DB
     * Close all open connections
     */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Get likes by userId', async () => {
    console.log('userId = ', testUser1);
    const resp = await request(webapp).get(`/likes/user/${testUser1}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const likeArr = JSON.parse(resp.text).data;
    expect(likeArr[0].userId).toEqual(testUser1);
  });

  test('Get likes by objectId', async () => {
    const resp = await request(webapp).get(`/likes/post/${testPost}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const likeArr = JSON.parse(resp.text).data;
    expect(likeArr[0].objectId).toEqual(testPost);
  });

  test('Get isliked', async () => {
    const resp = await request(webapp).get(`/likes/isliked/post/${testUser1}/${testPost}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const likeArr = JSON.parse(resp.text).data;
    expect(likeArr[0].userId).toEqual(testUser1);
  });
});

describe('Delete likes endpoint integration test', () => {
  /**
       * If you get an error with afterEach
       * inside .eslintrc.json in the
       * "env" key add -'jest': true-
      */
  let db;
  let testLikeID;
  let testUser1;
  let testUser2;
  let testPost;
  // test resource to create / expected response
  /**
          * Make sure that the data is in the DB before running
          * any test
          * connect to the DB
          */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res1 = await request(webapp).post('/users/').send('username=kevin&userEmail=a@b.com&password=123');
    testUser1 = JSON.parse(res1.text).data._id;
    const res2 = await request(webapp).post('/users/').send('username=silvia&userEmail=c@d.com&password=123');
    testUser2 = JSON.parse(res2.text).data._id;
    // const res3 = await request(webapp).post('/posts/')
    //   .send(`userId=${testUser2}&postContent=hi&timeStamp=1234&tags=sports`);
    const res3 = await request(webapp).post('/posts/')
      .send({
        userId: testUser2, postContent: { title: 'hi' }, timeStamp: '1234', tags: 'sports',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    testPost = JSON.parse(res3.text).data._id;
    const res4 = await request(webapp).post('/likes/')
      .send(`type=post&userId=${testUser1}&objectId=${testPost}&timeStamp=1234`);
    // eslint-disable-next-line no-underscore-dangle
    testLikeID = JSON.parse(res4.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result1 = await db.collection('users').deleteMany({ _id: ObjectId(testUser1) });
      const result2 = await db.collection('users').deleteMany({ _id: ObjectId(testUser2) });
      const result3 = await db.collection('posts').deleteMany({ _id: ObjectId(testPost) });
      const result4 = await db.collection('likes').deleteMany({ _id: ObjectId(testLikeID) });
      console.log('info', result1, result2, result3, result4);
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
      * Delete all test data from the DB
      * Close all open connections
      */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('delete like', async () => {
    const resp = await request(webapp).delete(`/likes/post/${testUser1}/${testPost}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const resp1 = await db.collection('likes').findOne({ _id: ObjectId(testLikeID) });
    expect(resp1).toBeNull();
  });
});

describe('GET comments endpoint integration test', () => {
  /**
       * If you get an error with afterEach
       * inside .eslintrc.json in the
       * "env" key add -'jest': true-
      */
  let db;
  let testUser;
  let testPost;
  let testCommentID;
  // test resource to create / expected response
  /**
           * Make sure that the data is in the DB before running
           * any test
           * connect to the DB
           */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res1 = await request(webapp).post('/users/').send('username=kevin&userEmail=a@b.com&password=123');
    testUser = JSON.parse(res1.text).data._id;
    const res2 = await request(webapp).post('/posts/')
      .send({
        userId: testUser, postContent: { title: 'hi' }, timeStamp: '1234', tags: 'sports',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    testPost = JSON.parse(res2.text).data._id;
    const res3 = await request(webapp).post('/comments/')
      .send(`userId=${testUser}&postId=${testPost}&content=hi&timeStamp=1234&affiliatedComment=1`);
      // eslint-disable-next-line no-underscore-dangle
    testCommentID = JSON.parse(res3.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result1 = await db.collection('users').deleteMany({ _id: ObjectId(testUser) });
      const result2 = await db.collection('posts').deleteMany({ _id: ObjectId(testPost) });
      const result3 = await db.collection('comments').deleteMany({ _id: ObjectId(testCommentID) });
      console.log('info', result1, result2, result3);
    } catch (err) {
      console.log('error', err.message);
    }
  };
    /**
       * Delete all test data from the DB
       * Close all open connections
       */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Get comments by userId', async () => {
    const resp = await request(webapp).get(`/comments/user/${testUser}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const commentArr = JSON.parse(resp.text).data;
    expect(commentArr[0].userId).toEqual(testUser);
  });

  test('Get comments by postId', async () => {
    const resp = await request(webapp).get(`/comments/post/${testPost}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const commentArr = JSON.parse(resp.text).data;
    expect(commentArr[0].postId).toEqual(testPost);
  });

  test('Get comment by commentId', async () => {
    const resp = await request(webapp).get(`/comments/${testCommentID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const commentArr = JSON.parse(resp.text).data;
    expect(commentArr[0]._id).toEqual(testCommentID);
  });
});

describe('Delete comments endpoint integration test', () => {
  /**
         * If you get an error with afterEach
         * inside .eslintrc.json in the
         * "env" key add -'jest': true-
        */
  let db;
  let testUser;
  let testPost;
  let testCommentID;
  // test resource to create / expected response
  /**
            * Make sure that the data is in the DB before running
            * any test
            * connect to the DB
            */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res1 = await request(webapp).post('/users/').send('username=kevin&userEmail=a@b.com&password=123');
    testUser = JSON.parse(res1.text).data._id;
    const res2 = await request(webapp).post('/posts/')
      .send({
        userId: testUser, postContent: { title: 'hi' }, timeStamp: '1234', tags: 'sports',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    testPost = JSON.parse(res2.text).data._id;
    const res3 = await request(webapp).post('/comments/')
      .send(`userId=${testUser}&postId=${testPost}&content=hi&timeStamp=1234&affiliatedComment=1`);
    // eslint-disable-next-line no-underscore-dangle
    testCommentID = JSON.parse(res3.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result1 = await db.collection('users').deleteMany({ _id: ObjectId(testUser) });
      const result2 = await db.collection('posts').deleteMany({ _id: ObjectId(testPost) });
      const result3 = await db.collection('comments').deleteMany({ _id: ObjectId(testCommentID) });
      console.log('info', result1, result2, result3);
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
        * Delete all test data from the DB
        * Close all open connections
        */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('delete comment', async () => {
    const resp = await request(webapp).delete(`/comments/${testCommentID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const resp1 = await db.collection('comments').findOne({ _id: ObjectId(testCommentID) });
    expect(resp1).toBeNull();
  });
});

describe('Put comments endpoint integration test', () => {
  /**
         * If you get an error with afterEach
         * inside .eslintrc.json in the
         * "env" key add -'jest': true-
        */
  let db;
  let testUser;
  let testPost;
  let testCommentID;
  // test resource to create / expected response
  /**
            * Make sure that the data is in the DB before running
            * any test
            * connect to the DB
            */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res1 = await request(webapp).post('/users/').send('username=kevin&userEmail=a@b.com&password=123');
    testUser = JSON.parse(res1.text).data._id;
    const res2 = await request(webapp).post('/posts/')
      .send({
        userId: testUser, postContent: { title: 'hi' }, timeStamp: '1234', tags: 'sports',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    testPost = JSON.parse(res2.text).data._id;
    const res3 = await request(webapp).post('/comments/')
      .send(`userId=${testUser}&postId=${testPost}&content=hi&timeStamp=1234&affiliatedComment=1`);
    // eslint-disable-next-line no-underscore-dangle
    testCommentID = JSON.parse(res3.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result1 = await db.collection('users').deleteMany({ _id: ObjectId(testUser) });
      const result2 = await db.collection('posts').deleteMany({ _id: ObjectId(testPost) });
      const result3 = await db.collection('comments').deleteMany({ _id: ObjectId(testCommentID) });
      console.log('info', result1, result2, result3);
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
        * Delete all test data from the DB
        * Close all open connections
        */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Update comment', async () => {
    const resp = await request(webapp).put(`/comments/${testCommentID}`).send(`_id=${testCommentID}&commentId=${testCommentID}&userId=${testUser}&postId=${testPost}&content=hello&timeStamp=1234&affiliatedComment=1`);
    console.log('status = ', resp.status);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
  });
});

describe('Get feeds endpoint integration test', () => {
  /**
       * If you get an error with afterEach
       * inside .eslintrc.json in the
       * "env" key add -'jest': true-
      */
  let db;
  let testUser1;
  let testUser2;
  let testFollowID;
  let testPost;
  // test resource to create / expected response
  /**
        * Make sure that the data is in the DB before running
        * any test
        * connect to the DB
        */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res1 = await request(webapp).post('/users/').send('username=kevin&userEmail=a@b.com&password=123');
    testUser1 = JSON.parse(res1.text).data._id;
    const res2 = await request(webapp).post('/users/').send('username=silvia&userEmail=c@d.com&password=123');
    testUser2 = JSON.parse(res2.text).data._id;
    const res3 = await request(webapp).post('/follows/')
      .send(`followerId=${testUser1}&followeeId=${testUser2}&timeStamp=1234`);
    testFollowID = JSON.parse(res3.text).data._id;
    const res4 = await request(webapp).post('/posts/')
      .send({
        userId: testUser2, postContent: { title: 'hi' }, timeStamp: '1234', tags: 'sports',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    testPost = JSON.parse(res4.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result1 = await db.collection('users').deleteMany({ _id: ObjectId(testUser1) });
      const result2 = await db.collection('users').deleteMany({ _id: ObjectId(testUser2) });
      const result3 = await db.collection('follows').deleteMany({ _id: ObjectId(testFollowID) });
      const result4 = await db.collection('posts').deleteMany({ _id: ObjectId(testPost) });
      console.log('info', result1, result2, result3, result4);
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
    * Delete all test data from the DB
    * Close all open connections
    */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('getFeeds', async () => {
    const resp = await request(webapp).get(`/feeds/${testUser1}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const feedArr = JSON.parse(resp.text).data;
    expect(feedArr[0].postContent.title).toEqual('hi');
    const follow = await db.collection('follows').findOne({ _id: ObjectId(testFollowID) });
    expect(follow.followerId).toEqual(testUser1);
    const post = await db.collection('posts').findOne({ _id: ObjectId(testPost) });
    expect(post.tags).toEqual('sports');
  });
});

describe('Get suggestions endpoint integration test', () => {
  /**
         * If you get an error with afterEach
         * inside .eslintrc.json in the
         * "env" key add -'jest': true-
        */
  let db;
  let testUserID1;
  let testUserID2;
  let testUserID3;
  let testUserID4;
  let testUserID5;
  let testFollowID1;
  let testFollowID2;
  let testFollowID3;
  let testFollowID4;
  let testFollowID5;
  let testFollowID6;
  // test resource to create / expected response
  /**
             * Make sure that the data is in the DB before running
             * any test
             * connect to the DB
             */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res1 = await request(webapp).post('/users/')
      .send('username=test1&userEmail=test1@test1.com&password=123');
    testUserID1 = JSON.parse(res1.text).data._id;
    const res2 = await request(webapp).post('/users/')
      .send('username=test2&userEmail=test2@test2.com&password=123');
    testUserID2 = JSON.parse(res2.text).data._id;
    const res3 = await request(webapp).post('/users/')
      .send('username=test3&userEmail=test3@test3.com&password=123');
    testUserID3 = JSON.parse(res3.text).data._id;
    const res4 = await request(webapp).post('/users/')
      .send('username=test4&userEmail=test4@test4.com&password=123');
    testUserID4 = JSON.parse(res4.text).data._id;
    const res5 = await request(webapp).post('/users/')
      .send('username=test5&userEmail=test5@test5.com&password=123');
    testUserID5 = JSON.parse(res5.text).data._id;
    const res6 = await request(webapp).post('/follows/')
      .send(`followerId=${testUserID1}&followeeId=${testUserID3}&timeStamp=1234`);
    testFollowID1 = JSON.parse(res6.text).data._id;
    const res7 = await request(webapp).post('/follows/')
      .send(`followerId=${testUserID1}&followeeId=${testUserID4}&timeStamp=1234`);
    testFollowID2 = JSON.parse(res7.text).data._id;
    const res8 = await request(webapp).post('/follows/')
      .send(`followerId=${testUserID1}&followeeId=${testUserID5}&timeStamp=1234`);
    testFollowID3 = JSON.parse(res8.text).data._id;
    const res9 = await request(webapp).post('/follows/')
      .send(`followerId=${testUserID2}&followeeId=${testUserID3}&timeStamp=1234`);
    testFollowID4 = JSON.parse(res9.text).data._id;
    const res10 = await request(webapp).post('/follows/')
      .send(`followerId=${testUserID2}&followeeId=${testUserID4}&timeStamp=1234`);
    testFollowID5 = JSON.parse(res10.text).data._id;
    const res11 = await request(webapp).post('/follows/')
      .send(`followerId=${testUserID2}&followeeId=${testUserID5}&timeStamp=1234`);
    testFollowID6 = JSON.parse(res11.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result1 = await db.collection('users').deleteMany({ _id: ObjectId(testUserID1) });
      const result2 = await db.collection('users').deleteMany({ _id: ObjectId(testUserID2) });
      const result3 = await db.collection('users').deleteMany({ _id: ObjectId(testUserID3) });
      const result4 = await db.collection('users').deleteMany({ _id: ObjectId(testUserID4) });
      const result5 = await db.collection('users').deleteMany({ _id: ObjectId(testUserID5) });
      const result6 = await db.collection('follows').deleteMany({ _id: ObjectId(testFollowID1) });
      const result7 = await db.collection('follows').deleteMany({ _id: ObjectId(testFollowID2) });
      const result8 = await db.collection('follows').deleteMany({ _id: ObjectId(testFollowID3) });
      const result9 = await db.collection('follows').deleteMany({ _id: ObjectId(testFollowID4) });
      const result10 = await db.collection('follows').deleteMany({ _id: ObjectId(testFollowID5) });
      const result11 = await db.collection('follows').deleteMany({ _id: ObjectId(testFollowID6) });
      console.log('info', result1, result2, result3, result4, result5, result6, result7, result8, result9, result10, result11);
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
         * Delete all test data from the DB
         * Close all open connections
         */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('get suggestions', async () => {
    const resp = await request(webapp).get(`/suggestions/${testUserID1}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const userArr = JSON.parse(resp.text).data;
    expect(userArr[0].userId).toEqual(testUserID2);
  });
});

describe('GET posts endpoint integration test', () => {
  /**
         * If you get an error with afterEach
         * inside .eslintrc.json in the
         * "env" key add -'jest': true-
        */
  let db;
  let testPostID;
  let testUserID;
  // test resource to create / expected response
  /**
             * Make sure that the data is in the DB before running
             * any test
             * connect to the DB
             */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res1 = await request(webapp).post('/users/')
      .send('username=kevin&userEmail=a@b.com&password=123');
    testUserID = JSON.parse(res1.text).data._id;
    const res2 = await request(webapp).post('/posts/')
      .send({
        userId: testUserID, postContent: { title: 'hi' }, timeStamp: '1234', tags: 'sports',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    testPostID = JSON.parse(res2.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result1 = await db.collection('users').deleteMany({ _id: ObjectId(testUserID) });
      const result2 = await db.collection('posts').deleteMany({ _id: ObjectId(testPostID) });
      console.log('info', result1, result2);
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
         * Delete all test data from the DB
         * Close all open connections
         */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Get posts by postId', async () => {
    const resp = await request(webapp).get(`/posts/${testPostID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const postArr = JSON.parse(resp.text).data;
    expect(postArr.postContent.title).toEqual('hi');
  });

  test('Get user posts', async () => {
    const resp = await request(webapp).get(`/users/${testUserID}/posts`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const postArr = JSON.parse(resp.text).data;
    expect(postArr[0].postContent.title).toEqual('hi');
  });
});

describe('Delete posts endpoint integration test', () => {
  /**
           * If you get an error with afterEach
           * inside .eslintrc.json in the
           * "env" key add -'jest': true-
          */
  let db;
  let testPostID;
  let testUserID;
  // test resource to create / expected response
  /**
              * Make sure that the data is in the DB before running
              * any test
              * connect to the DB
              */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res1 = await request(webapp).post('/users/')
      .send('username=kevin&userEmail=a@b.com&password=123');
    testUserID = JSON.parse(res1.text).data._id;
    const res2 = await request(webapp).post('/posts/')
      .send({
        userId: testUserID, postContent: { title: 'hi' }, timeStamp: '1234', tags: 'sports',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    testPostID = JSON.parse(res2.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result1 = await db.collection('users').deleteMany({ _id: ObjectId(testUserID) });
      const result2 = await db.collection('posts').deleteMany({ _id: ObjectId(testPostID) });
      console.log('info', result1, result2);
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
          * Delete all test data from the DB
          * Close all open connections
          */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Delete posts', async () => {
    const resp = await request(webapp).delete(`/posts/${testPostID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const resp1 = await db.collection('posts').findOne({ _id: ObjectId(testPostID) });
    expect(resp1).toBeNull();
  });
});

describe('Put posts endpoint integration test', () => {
  /**
           * If you get an error with afterEach
           * inside .eslintrc.json in the
           * "env" key add -'jest': true-
          */
  let db;
  let testPostID;
  let testUserID;
  // test resource to create / expected response
  /**
              * Make sure that the data is in the DB before running
              * any test
              * connect to the DB
              */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res1 = await request(webapp).post('/users/')
      .send('username=kevin&userEmail=a@b.com&password=123');
    testUserID = JSON.parse(res1.text).data._id;
    const res2 = await request(webapp).post('/posts/')
      .send({
        userId: testUserID, postContent: { title: 'hi' }, timeStamp: '1234', tags: 'sports',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    testPostID = JSON.parse(res2.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result1 = await db.collection('users').deleteMany({ _id: ObjectId(testUserID) });
      const result2 = await db.collection('posts').deleteMany({ _id: ObjectId(testPostID) });
      console.log('info', result1, result2);
    } catch (err) {
      console.log('error', err.message);
    }
  };
  /**
          * Delete all test data from the DB
          * Close all open connections
          */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Update Post', async () => {
    const resp = await request(webapp).put(`/posts/${testPostID}`)
      .send({
        _id: testPostID, postId: testPostID, userId: testUserID, postContent: { title: 'hello' }, timeStamp: '1234', tags: 'sports',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const updatedPost = await db.collection('posts').findOne({ _id: ObjectId(testPostID) });
    expect(updatedPost.postContent.title).toEqual('hello');
  });
});

describe('GET users endpoint integration test', () => {
  /**
           * If you get an error with afterEach
           * inside .eslintrc.json in the
           * "env" key add -'jest': true-
          */
  let db;
  let testUserID;
  // test resource to create / expected response
  /**
               * Make sure that the data is in the DB before running
               * any test
               * connect to the DB
               */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post('/users/')
      .send('username=kevin&userEmail=a@b.com&password=123');
    testUserID = JSON.parse(res.text).data._id;
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('users').deleteMany({ _id: testUserID });
      console.log('info', result);
    } catch (err) {
      console.log('error', err.message);
    }
  };
    /**
           * Delete all test data from the DB
           * Close all open connections
           */
  afterAll(async () => {
    await clearDatabase();
    try {
      await mongo.close();
      await closeMongoDBConnection(); // mongo client that started server.
    } catch (err) {
      return err;
    }
  });

  test('Get user by userId', async () => {
    const resp = await request(webapp).get(`/users/${testUserID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const userArr = JSON.parse(resp.text).data;
    expect(userArr.username).toEqual('kevin');
  });
});
