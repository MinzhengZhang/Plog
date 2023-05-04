import React from 'react';
import { Link } from 'react-router-dom';

function PastPost({ post }) {
  return <div className="h-40 w-40 ml-1 mb-1 hover:scale-110 cursor-pointer"><PostPreview post={post} /></div>;
}

function PostPreview({ post }) {
  const { postContent, postId } = post;

  if (!postContent || !postId) {
    return null;
  }

  const { photos, title } = postContent;
  if (photos && photos.length > 0 && postId) {
    return (<div className="h-40 w-40 border border-2 "><Link to={`/posts/${postId}`}><img className="h-full w-full" src={photos[0].src} alt="past post previe" aria-hidden="true" /></Link></div>);
  }
  if (title) {
    return (<div className="text-center font-sans align-middle p-4 font-bold text-xl h-40 w-40 border border-2 border-black hover:uppercase "><Link to={`/posts/${postId}`}>{title.slice(0, 50)}</Link></div>);
  }
  return null;
}

export default PastPost;
