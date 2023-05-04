// including follow button and unfollow button
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { follow, unfollow } from '../redux/actions/appActions';
import { getFollowsByFollowerId, addFollow, deleteFollow } from '../api/api_calls';

function FollowsButton({ followerId, followeeId }) {
  const followingStatus = useSelector((state) => state.follow);
  const currUserId = useSelector((state) => state.loginStatus.user.userId);

  // useDispatch
  const dispatch = useDispatch();
  async function handleUnfollow() {
    try {
      await deleteFollow(currUserId, followerId, followeeId);
      dispatch(unfollow(followeeId));
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async function handleFollow() {
    const timeStamp = new Date();
    const followObject = { followerId, followeeId, timeStamp };
    try {
      await addFollow(followObject);
      dispatch(follow(followeeId));
    } catch (err) {
      throw new Error(err.message);
    }
  }
  const following = new Set(followingStatus);

  useEffect(() => {
    async function fetchFollowStatus() {
      try {
        const allFollowing = await getFollowsByFollowerId(followerId);
        allFollowing.forEach((followData) => {
        // followData && followData.followeeId &&
          if (!following.has(followData.followeeId)) {
            const userId = followData.followeeId;
            dispatch(follow(userId));
          }
        });
      } catch (err) {
        throw new Error(err.message);
      }
    }
    fetchFollowStatus();
  });

  if (following.has(followeeId)) {
    return (
      <button type="button" onClick={handleUnfollow}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {' '}
          {' '}

          <path
            d="M6.50001 1.0835C5.4287
         1.0835 4.38144 1.40118 3.49067 1.99637C2.59991 2.59156
         1.90564 3.43753 1.49567 4.42729C1.08569 5.41706 0.978422 6.50617
         1.18743 7.5569C1.39643 8.60763 1.91232 9.57279 2.66985 10.3303C3.42739
         11.0879 4.39254 11.6037 5.44327 11.8128C6.494 12.0218 7.58311 11.9145 8.57288
         11.5045C9.56265 11.0945 10.4086 10.4003 11.0038 9.5095C11.599 8.61874 11.9167
         7.57148 11.9167 6.50016C11.9167 5.78884 11.7766 5.08447 11.5044 4.42729C11.2321
         3.77011 10.8332 3.17299 10.3302 2.67C9.82719 2.16702 9.23006 1.76803 8.57288 1.49582C7.9157
         1.2236 7.21134 1.0835 6.50001 1.0835V1.0835ZM8.82918 5.20558L6.35376 8.45558C6.3033 8.52113
         6.2385 8.57425 6.16432 8.61087C6.09015 8.64749 6.00857 8.66663 5.92585 8.66683C5.84357
         8.66727 5.76228 8.64897 5.68813 8.6133C5.61399 8.57764 5.54894 8.52555 5.49793 8.461L4.17626
         6.77641C4.13252 6.72022 4.10027 6.65596 4.08135 6.5873C4.06244 6.51864 4.05724 6.44693
         4.06604 6.37626C4.07484 6.30559 4.09748 6.23735 4.13265 6.17543C4.16783 6.1135 4.21486
         6.05912 4.27105 6.01537C4.38454 5.92702 4.52848 5.88737 4.67121 5.90515C4.74188 5.91395
         4.81012 5.93659 4.87204 5.97176C4.93396 6.00694 4.98835 6.05397 5.0321 6.11016L5.91501
          7.23683L7.96251 4.5285C8.0059 4.47159 8.06008 4.42379 8.12194 4.38782C8.18381 4.35185
         8.25215 4.32842 8.32307 4.31886C8.39399 4.3093 8.4661 4.31381 8.53528 4.33212C8.60446
         4.35043 8.66936 4.38219 8.72626 4.42558C8.78317 4.46897 8.83097 4.52315 8.86694
          4.58501C8.90291 4.64688 8.92634 4.71522 8.9359 4.78614C8.94546 4.85706 8.94095
           4.92917 8.92264 4.99835C8.90433 5.06753 8.87257 5.13242 8.82918 5.18933V5.20558Z"
            fill="#57B05B"
          />
        </svg>
      </button>
    );
  }
  return (
    <button type="button" onClick={handleFollow}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 13 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.5 0C5.21442 0 3.95771 0.381218 2.8888 1.09545C1.81988 1.80968 0.986755 2.82484
           0.494786 4.01256C0.00281635 5.20028 -0.125905 6.50721 0.124899
            7.76808C0.375702 9.02896 0.994767 10.1871 1.90381 11.0962C2.81285
             12.0052 3.97104 12.6243 5.23192 12.8751C6.49279 13.1259 7.79972 12.9972
              8.98744 12.5052C10.1752 12.0132 11.1903 11.1801 11.9046 10.1112C12.6188
               9.04228 13 7.78558 13 6.5C13 5.64641 12.8319 4.80117 12.5052 4.01256C12.1786
                3.22394 11.6998 2.50739 11.0962 1.90381C10.4926 1.30022 9.77606 0.821438 8.98744
                 0.494783C8.19883 0.168127 7.35359 0 6.5 0V0ZM8.45 7.15H7.15V8.45C7.15 8.62239 7.08152
                  8.78772 6.95962 8.90962C6.83772 9.03152 6.67239 9.1 6.5 9.1C6.32761 9.1 6.16228 9.03152
                   6.04038 8.90962C5.91848 8.78772 5.85 8.62239 5.85 8.45V7.15H4.55C4.37761 7.15 4.21228
                    7.08152 4.09038 6.95962C3.96848 6.83772 3.9 6.67239 3.9 6.5C3.9 6.32761 3.96848 6.16228
                     4.09038 6.04038C4.21228 5.91848 4.37761 5.85 4.55 5.85H5.85V4.55C5.85 4.37761 5.91848
                      4.21228 6.04038 4.09038C6.16228 3.96848 6.32761 3.9 6.5 3.9C6.67239 3.9 6.83772 3.96848
                       6.95962 4.09038C7.08152 4.21228 7.15 4.37761 7.15 4.55V5.85H8.45C8.62239 5.85 8.78772
                        5.91848 8.90962 6.04038C9.03152 6.16228 9.1 6.32761 9.1 6.5C9.1 6.67239 9.03152 6.83772
                         8.90962 6.95962C8.78772 7.08152 8.62239 7.15 8.45 7.15Z"
          fill="#5D8B5F"
        />
      </svg>

    </button>
  );
}
export default FollowsButton;
