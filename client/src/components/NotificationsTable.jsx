import React from 'react';
import Notification from './Notification';

function NotificationsTable({ notifications, currUserId }) {
  if (!notifications || notifications.length === 0) {
    return <div className="mt-10 font-bold text-xl"> There is no new notification</div>;
  }

  const results = notifications.map(
    (notification) => (
      <Notification
        key={notification.notId}
        user={notification.user}
        event={notification.event}
        currUserId={currUserId}
      />
    ),
  );
  return <article className="col-span-3">{results}</article>;
}

export default NotificationsTable;
