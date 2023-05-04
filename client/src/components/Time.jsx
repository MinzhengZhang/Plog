import React from 'react';

function Time({ timeStamp }) {
  // suppose timeStamp is string format time, new Date().toJaSON()
  if (!timeStamp) {
    return null;
  }

  const currentTime = new Date().getTime();
  const pastTime = new Date(timeStamp).getTime();

  if (!pastTime) {
    return null;
  }

  const timeDiff = currentTime - pastTime;
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years) {
    return (
      <span>
        {years}
        {' years ago'}
      </span>
    );
  }
  if (months) {
    return (
      <span>
        {months}
        {' months ago'}
      </span>
    );
  }
  if (days) {
    return (
      <span>
        {days}
        {' days ago'}
      </span>
    );
  }
  if (hours) {
    return (
      <span>
        {hours}
        {' hours ago'}
      </span>
    );
  }
  if (minutes) {
    return (
      <span>
        {minutes}
        {' minutes ago'}
      </span>
    );
  }
  if (seconds) {
    return (
      <span>
        {seconds}
        {' seconds ago'}
      </span>
    );
  }
  return <span>1 second ago</span>;
}

export default Time;
