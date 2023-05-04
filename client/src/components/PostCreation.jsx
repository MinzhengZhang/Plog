// this component supports both edit and create funcitonality
import React, { useState, useRef, useEffect } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { useNavigate } from 'react-router-dom';
import Switch from './Switch';
import Dropdown from './Dropdown';
import {
  createPost, updatePost, getUserByUserId, getFriends,
} from '../api/api_calls';
import Warning from './Warning';
import { uploadFileToS3, deleteS3File } from '../api/s3';

function isTitleValid(title) {
  if (!title || title.trim() === '') {
    return false;
  }
  if (title.length > 50) {
    return false;
  }
  return true;
}

function PostCreation({
  currUserId, post, type, setEditPattern,
}) {
  const navigate = useNavigate();
  let initialTitle = '';
  let initialTags = '';
  let initialContentText = '';
  let initialPhotos = [];
  let initialVideos = [];
  let initialBlockList = [];
  if (type === 'edit' && post && post.postContent) {
    initialTitle = post.postContent.title;
    if (post.tags) {
      initialTags = post.tags.reduce((acc, tag) => `${acc} ${tag}`, '');
    }
    if (post.postContent.contentText) {
      initialContentText = post.postContent.contentText;
    }
    if (post.postContent.photos) {
      initialPhotos = post.postContent.photos;
    }
    if (post.postContent.videos) {
      initialVideos = post.postContent.videos;
    }
    if (post.blockList) {
      initialBlockList = post.blockList;
    }
  }

  const [title, setTitle] = useState(initialTitle);
  const [tagsText, setTags] = useState(initialTags);
  const [text, setText] = useState(initialContentText);
  const [photos, setPhotos] = useState(initialPhotos);
  const [videos, setVideos] = useState(initialVideos);
  const [isPublic, setIsPublic] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const firstRendering = useRef(true);
  const [blockList, setBlockList] = useState(initialBlockList);
  const [options, setOptions] = useState([]);
  const [warningMessage, setWarningMessage] = useState('');
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getFriends(currUserId);
        const friendsPromises = [];
        result.forEach((friendId) => {
          const friend = getUserByUserId(friendId);
          friendsPromises.push(friend);
        });
        const friends = await Promise.all(friendsPromises);
        setAllUsers(friends);
        setOptions([{ id: '*', option: 'Everyone' }, ...friends.map((user) => (
          {
            id: user.userId,
            option: user.username,
          }
        )),
        ]);
      } catch (err) {
        throw new Error(err.message);
      }
    }
    if (firstRendering.current) {
      firstRendering.current = false;
      fetchData();
    }
  }, []);

  const handleTagsInput = (event) => {
    setTags(event.target.value);
  };

  const handleTitleInput = (event) => {
    setTitle(event.target.value);
  };

  // this is to handle the mentions(contentText) input
  const handleTextInput = (event) => {
    setText(event.target.value);
  };

  const handleUploadPhotos = async (event) => {
    const medias = event.target.files;
    const file = medias[0];

    if (!file || !file.type.includes('image')) {
      setWarningMessage('Uploaded File should be an image');
      return;
    }
    if (file.size / 1024 / 1024 > 10) {
      setWarningMessage('Photo size should be less than 10MB');
      return;
    }
    const photo = await uploadFileToS3(file, 'photos'); // photo should be an object with id and src
    if (photo && photo.id && photo.src) {
      setPhotos([...photos, photo]);
    }
  };

  const handleUploadVideos = async (event) => {
    const medias = event.target.files;
    const file = medias[0];
    if (!file || !file.type.includes('video')) {
      setWarningMessage('Uploaded File should be a video');
      return;
    }
    if (file.size / 1024 / 1024 > 300) {
      setWarningMessage('Video size should be less than 300MB');
      return;
    }

    const video = await uploadFileToS3(file, 'videos'); // video should be an object with id and src
    if (video && video.id && video.src) {
      setVideos([...videos, video]);
    }
  };

  const handleDeletePhoto = (id) => {
    const photo = photos.find((p) => p.id === id);
    if (photo && photo.src && photo.src.includes('s3.amazonaws.com')) {
      deleteS3File(photo.src, 'photos');
    }
    const newPhotos = photos.filter((item) => item.id !== id);
    setPhotos(newPhotos);
  };

  const handleDeleteVideo = (id) => {
    const video = videos.find((p) => p.id === id);
    if (video && video.src && video.src.includes('s3.amazonaws.com')) {
      deleteS3File(video.src, 'videos');
    }
    const newVideos = videos.filter((item) => item.id !== id);
    setVideos(newVideos);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isTitleValid(title)) {
      setWarningMessage('Title should be between 1 and 50 characters');
      return;
    }

    const postContent = {
      title,
      text,
      photos,
      videos,
    };

    const tagsTrim = tagsText.trim();
    let tags = [];
    if (tagsTrim.length) {
      tags = tagsTrim.split(' ');
    }
    let postId = '';
    if (type === 'edit') {
      postId = post.postId;
    }

    const newPost = {
      userId: currUserId,
      tags,
      postContent,
      postId,
      blockList,
    };

    setPhotos([]);
    setVideos([]);
    setTitle('');
    setTags('');
    setText('');

    if (type === 'edit') {
      try {
        await updatePost(postId, newPost);
        setEditPattern(false);
        return;
      } catch (err) {
        throw new Error(err.message);
      }
    }

    // create a new post
    try {
      const res = await createPost(newPost);
      postId = res.postId;
      if (postId && postId !== '') {
        navigate(`/posts/${postId}`);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }

  // get all users to give at mention suggestions
  const users = [];
  allUsers.map((user) => users.push({ id: user.userId, display: user.username }));

  const photosPreview = photos.map((photo) => (
    <PhotoDisplay
      key={photo.id}
      photo={photo}
      deleteFunc={handleDeletePhoto}
    />
  ));
  const videosPreview = videos.map((video) => (
    <VideoDisplay
      key={video.id}
      video={video}
      deleteFunc={handleDeleteVideo}
    />
  ));

  return (
    <div className="p-3 border w-auto">
      <div className="max-w-2xl mx-auto">

        <form className="post-form" id="form">

          <div className="max-w-2xl mx-auto">
            <Switch toggle={isPublic} setToggle={setIsPublic} />
            {!isPublic && allUsers && (
            <Dropdown
              options={options}
              selected={blockList}
              setSelected={setBlockList}
            />
            )}
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Title
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                </div>
                <input type="text" id="title" value={title} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Add Title" onChange={handleTitleInput} required />
              </div>
            </label>

            <label htmlFor="tags" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Tags
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                  #
                </span>
                <input type="text" id="tags" value={tagsText} className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={handleTagsInput} placeholder="Tags for post, split by ' ' " />
              </div>
            </label>
          </div>

          <br />

          <div className="mb-4 w-full bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div className="flex justify-between items-center py-2 px-3 border-b dark:border-gray-600">
              <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x dark:divide-gray-600">
                <div className="flex items-center space-x-1 sm:pr-4">

                  {/* upload photo */}
                  <label className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" htmlFor="photos">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>

                    <input type="file" id="photos" className="hidden" onChange={handleUploadPhotos} />
                  </label>
                  {/* upload video */}
                  <label type="button" className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600" htmlFor="videos">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>

                    <input type="file" id="videos" className="hidden" onChange={handleUploadVideos} />
                  </label>
                </div>

              </div>
            </div>

            <div className="py-2 px-4 bg-white rounded-b-lg dark:bg-gray-800">
              <MentionsInput value={text} onChange={handleTextInput} id="editor" className="block px-0 w-full text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write an article...">
                <Mention
                  trigger="@"
                  data={users}
                />
              </MentionsInput>
            </div>

          </div>

          <div className="container m-2 flex flex-wrap items-center mb-10 w-full min-h-40 border ">
            <h2 className="font-bold text-xl">Photos/Videos display:</h2>
            {photosPreview}
            {videosPreview}
          </div>
          <button type="submit" className="flex items-center text-xl font-bold mt-2 text-white bg-green-700 hover:bg-green-500 focus:outline-none focus:ring-4 focus:ring-green-400 font-medium rounded-full text-sm px-10 py-2.5 text-center mr-2 mb-2 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={handleSubmit}>{type}</button>
          {warningMessage !== '' && <Warning message={warningMessage} onClose={setWarningMessage} />}
        </form>

      </div>
    </div>
  );
}

function CloseButton({ onClick }) {
  return (
    <button type="button" className="relative top-10 left-3/4 ml-20 bg-transparent rounded-md p-2 inline-flex items-center justify-center text-red-600 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500" onClick={onClick}>
      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );
}

function PhotoDisplay(props) {
  const { photo, deleteFunc } = props;
  const handleDeleteClick = () => {
    deleteFunc(photo.id);
  };
  return (
    <div key={photo.id}>
      <CloseButton type="button" className="button" onClick={handleDeleteClick} />
      <img key={photo.id} className="max-h-50 max-w-full" src={photo.src} alt="uploaded img" />
    </div>
  );
}

function VideoDisplay(props) {
  const { video, deleteFunc } = props;
  const handleDeleteClick = () => {
    deleteFunc(video.id);
  };
  return (
    <div key={video.id}>
      <CloseButton type="button" className="button" onClick={handleDeleteClick} />
      <video src={video.src}>
        <source src={video.src} type="video/mp4" />
        <track kind="captions" key={video.id} src={video.src} alt="uploaded video" />
      </video>
    </div>
  );
}

export default PostCreation;
