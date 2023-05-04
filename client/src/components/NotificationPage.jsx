import React from 'react';
import { useSelector } from 'react-redux';
import NotificationsTable from './NotificationsTable';
import Banner from './Banner';
import Navbar from './Navbar';
// import person10 from '../assets/image/avatars/Ellipse 19.png';

const notifications = [
  // {
  //   notId: 1, user: { userId: 1, name: 'ZZZ', avatar: 'https://i.pravatar.cc/300' }, event: { action: 'followed', object: 'you', timeStamp: '3 minutes' },
  // },
  // {
  //   notId: 2,
  //   user: { userId: 2, name: 'YYYZ', avatar: 'https://i.pravatar.cc/300' },
  //   event: {
  //     action: 'liked', object: 'post', post: 'aaaaa', timeStamp: '3 minutes',
  //   },
  // },
  // {
  //   notId: 3,
  //   user: { userId: 3, name: 'XXXX', avatar: 'https://i.pravatar.cc/300' },
  //   event: {
  //     action: 'commented', object: 'comment', comment: 'hello world', timeStamp: '3 minutes',
  //   },
  // },
];

export default function Notification() {
  const {
    avatar, name, username, userId,
  } = useSelector((state) => state.loginStatus.user);
  return (
    <div>
      <Banner />
      <span className="inline-grid grid-cols-3 gap-4">
        <span className="col-span-2">
          <Navbar
            counts={{ notifications: 7 }}
            username={username}
            name={name}
            avatar={avatar}
          />
        </span>
        <span className="col-span-1"><NotificationsTable notifications={notifications} currUserId={userId} /></span>
      </span>
    </div>
  );
}
