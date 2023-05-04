import React from 'react';
import Time from './Time';
import UserInfo from './UserInfo';

function Notification(props) {
  // argument:{user, avatar, action, object, *comment, *post, *ref, timeStamp}
  let notificationEvent;
  const {
    user, event, currUserId,
  } = props;
  const {
    action, object, timeStamp, post, postId, comment,
  } = event;

  if (!user || !user.userId || !user.name || !action) {
    return null;
  }

  if (action === 'followed' || (!object || object === 'you')) {
    notificationEvent = <span className="text-xs leading-none font-medium">followed you</span>;
  } else {
    notificationEvent = (
      <span className="text-xs leading-none font-medium">
        <span>{action}</span>
        {' '}
        your
        {' '}
        {object}
      </span>
    );
  }
  return (
    <div className="mb-3">
      <div className="w-full h-auto relative">
        <div className="bg-white  px-5 py-3.5 rounded-lg shadow hover:shadow-xl max-w-sm mx-auto transform hover:-translate-y-[0.125rem] transition duration-100 ease-linear">
          <div className="w-full flex items-center justify-between">
            <span className="font-medium text-sm text-slate-400">New Notification</span>
            <button type="button" className="-mr-1 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 h-5 w-5 rounded-full flex justify-center items-center">
              <svg className="h-2 w-2 fill-current items-center" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" /></svg>
            </button>
          </div>
          <div className="flex items-center mt-2 rounded-lg px-1 py-1 cursor-pointer">
            <div className="relative flex flex-shrink-0 items-end">

              <UserInfo userId={user.userId} currUserId={currUserId} />
            </div>

            <div className="ml-3">
              <span className="font-semibold tracking-tight text-xs mr-1"><a href={`./user/${user.userId}`}>{user.name}</a></span>
              {notificationEvent}
              {(object === 'comment' && comment) && <p className="text-xs leading-4 pt-2 italic opacity-70">{comment}</p> }
              {(object === 'post' && postId) && (
              <span className="ml-1 text-xs leading-4 pt-2 italic opacity-70">
                <a href={`./post/${postId}`}>
                  `&quot;`
                  {post}
                  `&quot;`
                </a>
              </span>
              ) }
              <span className="text-[10px] font-medium leading-4 opacity-50 ml-1">
                <Time timeStamp={timeStamp} />
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
export default Notification;
