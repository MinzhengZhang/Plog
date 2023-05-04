import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

function PostContent(props) {
  if (!props) {
    return null;
  }
  if (!props) {
    return null;
  }
  const { postContent } = props;
  const {
    title, text, photos, videos,
  } = postContent;

  const content = [];
  if (title) {
    content.push(<h2 key={content.length} className="font-bold ">{title}</h2>);
  }

  if (photos && photos.length >= 1) {
    // const photosComponents =
    // photos.map((photo, i) => <img src={photo.src} key={photo.id} alt={`postPhoto${i}`} />);
    // content.push(<div className="flex flex-wrap items-center"
    // key={content.length}>{photosComponents}</div>);
    const photosComponents = photos.map((photo) => (<div key={photo.id}><img src={photo.src} alt="post" /></div>));
    content.push(
      <Carousel
        key={content.length}
        showStatus={false}
        infiniteLoop={1}
        autoPlay={1}
        showThumbs={false}
      >
        {photosComponents}
      </Carousel>,
    );
  }

  if (videos && videos.length >= 1) {
    const videosComponents = videos.map((video, i) => (
      <video key={video.id} controls>
        <source src={video.src} type="video/mp4" />
        <track kind="captions" key={video.id} src={video.src} alt={`postVideo${i}`} />
      </video>
    ));
    content.push(<div key={content.length}>{videosComponents}</div>);
  }
  if (text) {
    content.push(<p className="" key={content.length}>{text}</p>);
  }
  return (
    <div className="border">
      {content}
      {' '}

    </div>
  );
}

export default PostContent;
