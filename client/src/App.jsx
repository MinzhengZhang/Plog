import './style/SignIn.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignIn from './components/SignIn';
import Register from './components/Register';
import FeedsPage from './components/FeedsPage';
import NotificationPage from './components/NotificationPage';
import UserProfile from './components/UserProfile';
import LikesPage from './components/LikesPage';
import Follows from './components/Follows';
import NewPost from './components/NewPost';
import PostPage from './components/PostPage';
import SearchPage from './components/SearchPage';

function App() {
  const authentication = useSelector((state) => state.loginStatus.isLogin);
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/feeds" element={authentication ? <FeedsPage /> : <SignIn />} />
        <Route path="/notifications" element={authentication ? <NotificationPage /> : <SignIn />} />
        <Route path="/profile/:id" element={authentication ? <UserProfile /> : <SignIn />} />
        <Route path="/likes/:id" element={authentication ? <LikesPage /> : <SignIn />} />
        <Route path="/follows" element={authentication ? <Follows /> : <SignIn />} />
        <Route path="/newPost" element={authentication ? <NewPost /> : <SignIn />} />
        <Route path="/posts/:id" element={authentication ? <PostPage /> : <SignIn />} />
        <Route path="/search" element={authentication ? <SearchPage /> : <SignIn />} />
        <Route component={SignIn} />
      </Routes>
    </div>
  );
}

export default App;
