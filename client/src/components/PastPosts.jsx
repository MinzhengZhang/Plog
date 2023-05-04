import React from 'react';
import PastPost from './PastPost';

function PastPosts({ posts, title }) {
  let postArr = [];
  if (posts.length > 0 && posts[0].postId) {
    postArr = posts.map(
      (post) => (
        <div key={post.postId}>
          <PastPost
            key={post.postId}
            postId={post.postId}
            post={post}
          />
        </div>
      ),
    );
    const pastPostsComponent = (
      <div className="box-border">
        <div className="text-xl font-bold mt-7">{title}</div>
        <div className="grid grid-cols-3 col-span-3 gap-2">
          {postArr}
        </div>
      </div>
    );

    return pastPostsComponent;
  }

  const pastPostsComponent = (
    <div>
      <div className="text-xl font-bold mt-7">{title}</div>
      <div>
        <p className="text-xl font-bold">
          Empty
          {' '}
          {title}
          .
        </p>
      </div>
    </div>
  );
  return pastPostsComponent;
}

export default PastPosts;
