import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { searchUsers } from '../api/api_calls';
import Banner from './Banner';
import Navbar from './Navbar';
// import SearchResult from './SearchResult';
import UserInfo from './UserInfo';

function SearchPage() {
  const currUserId = useSelector((state) => state.loginStatus.user.userId);
  const { search } = useLocation();
  let keyword = search.split('?username=')[1] || '';
  keyword = keyword.replace('+', ' ');
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await searchUsers(keyword);
        setUsers(data);
      } catch (err) {
        throw new Error(err.message);
      }
    }
    fetchUsers();
  }, []);
  return (
    <div>
      <Banner />
      <Navbar />
      <div className="absolute right-60 top-32 w-1/2">
        <h1 className="font-bold text-2xl mb-3">Search Page</h1>
        {users.map((user) => (
          <UserInfo
            key={user.userId}
            userId={user.userId}
            currUserId={currUserId}
          />
        ))}
      </div>
    </div>
  );
}
export default SearchPage;
