import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import homeIcon from '../assets/image/home.png';
import notificationsIcon from '../assets/image/Notifications.png';
import profileIcon from '../assets/image/Profile.png';
import likesIcon from '../assets/image/Likes.png';
import followsIcon from '../assets/image/Follows.png';
import { logout } from '../redux/actions/appActions';

export function Num({ count }) {
  if (!count || count <= 0) {
    return (
      <span className=" object-right-top inline-flex  text-xs items-center p-1 w-1 h-1 text-sm font-bold text-black-800 rounded-full" />
    );
  }
  return (
    <span className="object-right-top inline-flex  text-xs items-center p-1 w-1 h-1 text-sm font-bold text-black-800 rounded-full">
      {count}
    </span>
  );
}

function Icon({ src, alt }) {
  return <img className="inline-block h-7 w-7 " src={src} alt={alt} />;
}

function IconNum({ src, alt, count }) {
  return (
    <span>
      <Icon src={src} alt={alt} />
      <Num count={count} />
    </span>
  );
}

function NavText({ title }) {
  return (
    <span className="text-left font-bold ml-16 ">
      {title}
    </span>
  );
}

function NavRow({
  src, title, count, link,
}) {
  return (
    <li aria-hidden="true">
      <Link
        to={link}
        className="flex mb-2 mt-2 items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <IconNum src={src} alt={title} count={count} />
        <NavText title={title} />
      </Link>
    </li>
  );
}

function NewPostButton() {
  const navigate = useNavigate();
  const navigateToNewPost = () => {
    navigate('/newPost');
  };
  return (
    <button
      type="submit"
      className="text-xl font-bold mt-7
      text-white bg-green-900 hover:bg-green-500
      focus:outline-none focus:ring-4
      focus:ring-green-300 font-medium rounded-full
      text-sm px-14 py-2.5 text-center mr-2 mb-2
      dark:bg-green-600 dark:hover:bg-green-700
      dark:focus:ring-green-800"
      onClick={navigateToNewPost}
    >
      New Post
    </button>
  );
}

function User({
  userId, username, avatar,
}) {
  return (
    <Link
      to={`/profile/${userId}`}
    >
      <div className="mt-40 flex items-center" aria-hidden="true">
        <img className="rounded-full h-20 w-20 inline-block" src={avatar} alt="user profile img" />
        <div className="ml-5 inline-block font-medium">
          <span>{username}</span>
          <br />
          <span>
            @
            {username}
          </span>
        </div>
      </div>
    </Link>
  );
}
function LogoutButton() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    sessionStorage.removeItem('app-token');
    dispatch(logout());
  };
  return (
    <button className=" font-bold" type="button" onClick={handleLogout}>
      <svg
        className="w-6 h-6 inline-block"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      Logout
    </button>
  );
}

function Navbar() {
  const {
    avatar, name, username, userId,
  } = useSelector((state) => state.loginStatus.user);
  const sidebarElems = [
    {
      title: 'Homepage',
      // count: counts.homepage,
      src: homeIcon,
      link: '/',
    },
    {
      title: 'Notifications',
      // count: counts.notifications,
      src: notificationsIcon,
      link: '/notifications',
    },
    {
      title: 'Likes',
      // count: counts.likes,
      src: likesIcon,
      link: `/likes/${userId}`,
    },
    {
      title: 'Follows',
      // count: counts.likes,
      src: followsIcon,
      link: '/follows',
    },
    {
      title: 'Profile',
      // count: counts.profile,
      src: profileIcon,
      link: `/profile/${userId}`,
    },
  ];

  const sidebar = sidebarElems.map((elem) => (
    <NavRow
      key={elem.title}
      title={elem.title}
      count={elem.count}
      src={elem.src}
      link={elem.link}
    />
  ));

  return (
    <aside className="inline-block ml-4 w-auto sm:w-auto mr-5" aria-label="Sidebar">
      <div className="overflow-y-auto py-4 px-3 sm:px-auto rounded dark:bg-gray-800">
        <ul className="space-y-2">{sidebar}</ul>
        <NewPostButton />
        <User username={username} name={name} avatar={avatar} userId={userId} />
        <div className="mt-10 ml-7">
          <LogoutButton />
        </div>
      </div>

    </aside>
  );
}

export default Navbar;
