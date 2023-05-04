import React, { useEffect, useState } from 'react';
import Feed from './Feed';
import { getFeeds } from '../api/api_calls';

function FeedsTable({ currUserId }) {
  const PAGESIZE = 10;
  const [feedsState, setFeedsState] = useState([]);
  const [loading, setLoading] = useState(true);
  // loading time is like pagination, to avoid get the duplicate data
  const [loadingTimes, setLoadingTimes] = useState(0);
  const [hasLoadedAll, setHasLoadedAll] = useState(false);

  async function fetchMoreFeeds() {
    try {
      if (currUserId) {
        const data = await getFeeds(currUserId, loadingTimes);
        if (data.length === 0 || data.length < PAGESIZE) {
          setHasLoadedAll(true);
          setLoading(false);
        }
        setFeedsState([...feedsState, ...data]);
        setLoading(false);
        setLoadingTimes(loadingTimes + 1);
      }
    } catch (err) {
      throw new Error(err.message);
    }
  }
  useEffect(() => {
    if (loading) {
      fetchMoreFeeds();
    }
  }, [loading]);

  // console.log('loadingTimes', loadingTimes);

  async function updateFeeds() {
    const updatedPromise = [];
    for (let i = 0; i < loadingTimes; i += 1) {
      const data = getFeeds(currUserId, i);
      updatedPromise.push(data);
    }
    const updatedFeeds = await Promise.all(updatedPromise);

    const updatedFeedsState = [];
    for (let i = 0; i < updatedFeeds.length; i += 1) {
      updatedFeedsState.push(...updatedFeeds[i]);
    }
    setFeedsState([...updatedFeedsState]);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateFeeds();
    }, 5000);
    return () => clearInterval(interval);
  }, [loadingTimes, feedsState]);

  function handleScroll() {
    if (document.documentElement.scrollHeight
      - document.documentElement.scrollTop
       === document.documentElement.clientHeight && !hasLoadedAll) {
      setLoading(true);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let feedsComponents;
  if (feedsState.length > 0 && feedsState[0] && feedsState[0].postId) {
    feedsComponents = feedsState.map((feed) => (
      <Feed
        key={feed.postId}
        post={feed}
        currUserId={currUserId}
      />
    ));
  } else {
    feedsComponents = (
      <h1 className="font-bold text-xl">
        There is no current feeds.
        Please follow some people to get their feeds activity.
      </h1>
    );
  }

  return (
    <div className="absolute left-80 top-28 p-3 w-1/2">
      <h1 className="mt-2 mb-1 font-bold text-3xl block">Feeds</h1>
      <div className="w-auto ">
        {feedsComponents}
      </div>
      {!hasLoadedAll && loading && 'loading...'}
      {hasLoadedAll && "You've reached the end of the feeds! No more feeds"}
    </div>
  );
}

export default FeedsTable;
