/* eslint-disable default-param-last */
import { combineReducers } from 'redux';
import jwtDecode from 'jwt-decode';

export const loginStatus = (state = {
  isLogin: sessionStorage.getItem('app-token') !== null && sessionStorage.getItem('app-token') !== undefined,
  user: sessionStorage.getItem('app-token') !== null && sessionStorage.getItem('app-token') !== undefined
    ? {
      userId: jwtDecode(sessionStorage.getItem('app-token')).id, userEmail: jwtDecode(sessionStorage.getItem('app-token')).userEmail, username: jwtDecode(sessionStorage.getItem('app-token')).username, avatar: jwtDecode(sessionStorage.getItem('app-token')).avatar,
    } : undefined,
}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        isLogin: true,
        user: action.user,
      };
    case 'LOGOUT':
      return {
        isLogin: false,
        user: undefined,
      };
    case 'UPDATE_AVATAR':
      // eslint-disable-next-line no-case-declarations
      const newUser = { ...state.user };
      newUser.avatar = action.avatar;
      return {
        isLogin: true,
        user: newUser,
      };
    default:
      return state;
  }
};

export function follow(state = [], action) {
  switch (action.type) {
    case 'FOLLOW_USER': {
      return [action.userId, ...state];
    }
    case 'UNFOLLOW_USER': {
      return state.filter((userId) => userId !== action.userId);
    }
    case 'LOGOUT': {
      return [];
    }
    default: {
      return state;
    }
  }
}

export const comments = (state = [], action) => {
  switch (action.type) {
    case 'LOAD_COMMENTS':
      return action.commentsIds;
    case 'ADD_COMMENT':
      return [action.commentId, ...state];
    case 'DELETE_COMMENT':
      return state.filter((commentId) => commentId !== action.commentId);
    case 'LOGOUT':
      return [];
    default:
      return state;
  }
};

// export const likes = (state = [], action) => {
//   switch (action.type) {
//     case 'LIKE':
//       return [action.post, ...state];
//     case 'DELETE_POST':
//       return state.filter((post) => post.postId !== action.post.postId);
//     case 'LOGOUT':
//       return [];
//     case 'LOGIN':
//       return [action.user.likes];
//     default:
//       return state;
//   }
// };

const rootReducer = combineReducers({
  loginStatus, follow, comments,
});

export default rootReducer;
