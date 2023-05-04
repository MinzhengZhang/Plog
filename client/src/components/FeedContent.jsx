import React from 'react';

function FeedContent(props) {
  if (!props) {
    return null;
  }
  const { postContent } = props;
  const {
    title, text, photos, videos,
  } = postContent;

  const content = [];
  if (title) {
    content.push(
      <h2 key={content.length} className="p-1 block font-bold">
        {title}
      </h2>,
    );
  }

  if (text) {
    let feedText = text;
    // maximum show 700 characters in feed preview mode
    if (feedText.length > 700) {
      feedText = `${text.slice(0, 699)} ...`;
    }
    content.push(
      <p className="p-1" key={content.length}>
        {feedText}
      </p>,
    );
  }

  if (photos && photos.length >= 1) {
    // maximum show 9 pictures in preview mode
    let feedPhotos = photos;
    const length = Math.min(feedPhotos.length, 9);
    // const width = String(Math.min(length, 3));
    feedPhotos = photos.slice(0, length);
    // hover:scale-110 cursor-pointer
    feedPhotos = feedPhotos.map((photo, i) => <div key={photo.id} className="flex flex-wrap h-40 w-40"><div key={photo.id} className="w-full h-full p-1 md:p-2"><img className="block object-cover object-center w-full h-full rounded-lg" src={photo.src} alt={`post_pic${i}`} /></div></div>);
    content.push(
      <div className="m-2 flex flex-wrap items-center" key={content.length}>
        {feedPhotos}
      </div>,
    );
  }

  if (videos && videos.length >= 1) {
    // maximum show 1 video in preview mode
    content.push(
      <div key={content.length}>
        <video key={content.length}>
          <source src={videos[0].src} type="video/mp4" />
          <track kind="captions" src={videos[0].src} alt="postVideo0" />
        </video>
      </div>,
    );
  }

  return <div className="border">{content}</div>;
}

export default FeedContent;
