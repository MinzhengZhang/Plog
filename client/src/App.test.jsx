/**
 * @jest-environment jsdom
 */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable jest/valid-expect */
import React from 'react';

import { configureStore } from '@reduxjs/toolkit';
import {
  act, screen, waitFor, render,
} from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { wait } from '@testing-library/user-event/dist/utils';
import axios, * as others from 'axios';
import Register from './components/Register';
import SignIn from './components/SignIn';
import rootReducer from './redux/reducers';
// import FeedsPage from './components/FeedsPage';
import '@testing-library/jest-dom/extend-expect';
// import renderer from 'react-test-renderer';
// import store from './redux/store/store';
import FeedsPage from './components/FeedsPage';
import App from './App';

describe('UI Test', () => {
  test('renders input fields for sign in', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    await waitFor(() => { expect(screen.getByRole('textbox')).toBeInTheDocument(); });
  });

  test('renders button for sign up', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    await waitFor(() => { expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument(); });
  });

  test('renders input fields for register', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    await waitFor(() => { expect(screen.getByRole('img', { name: 'Plog Icon' })).toBeInTheDocument(); });
  });

  test('renders button', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    await waitFor(() => { expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument(); });
  });

  test('Input of email is displayed in sign in', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    const element = screen.getByPlaceholderText('Email');
    await act(async () => {
      userEvent.type(element, 'test@email.com');
    });
    await waitFor(() => { expect(element).toHaveValue('test@email.com'); });
  });

  test('Input of email is displayed in register', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    // create a reference to the textbox
    const element = screen.getByPlaceholderText('Email');
    // type some text into the textbox
    await act(async () => {
      userEvent.type(element, 'test@email.com');
    });
    await waitFor(() => { expect(element).toHaveValue('test@email.com'); });
  });

  test('Register Display', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    const signup = await screen.findByRole('button', { name: /sign up/i });
    await act(async () => {
      userEvent.click(signup);
    });
    const title = await screen.findByRole('heading', { name: /sign up to see plogs from friends/i });
    const text = await screen.findByText(/by signing up, you agree to our\./i);
    await waitFor(() => { expect(title).toBeInTheDocument(); });
    await waitFor(() => { expect(text).toBeInTheDocument(); });
  });

  test('Feeds display', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    await act(async () => {
      const email = screen.getByPlaceholderText('Email');
      const password = screen.getByPlaceholderText('Password');
      const login = screen.getByRole('button', { name: 'Sign in' });
      userEvent.type(email, 'minzheng@seas.upenn.edu');
      userEvent.type(password, '123456');
      userEvent.click(login);
    });

    const homepage = await screen.findByText('Homepage');
    const time = await screen.findAllByText(/updated/i);
    const tags = await screen.findAllByText(/tags:/i);
    await act(async () => {
      await waitFor(() => { expect(homepage).toBeInTheDocument(); });
      await waitFor(() => { expect(time).not.toBeNull(); });
      await waitFor(() => { expect(tags).not.toBeNull(); });
    });
  });

  test('Notifications display', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    const login = screen.getByRole('button', { name: 'Sign in' });
    await act(async () => {
      userEvent.type(email, 'minzheng@seas.upenn.edu');
      userEvent.type(password, '123456');
      userEvent.click(login);
    });
    const notification = await screen.findByText('Notifications');
    await act(async () => {
      userEvent.click(notification);
    });
    const newNotifications = await screen.findAllByText(/New Notification/i);
    await waitFor(() => { expect(newNotifications).toHaveLength(3); });
  });

  test('Likes display', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    const login = screen.getByRole('button', { name: 'Sign in' });
    await act(async () => {
      userEvent.type(email, 'minzheng@seas.upenn.edu');
      userEvent.type(password, '123456');
      userEvent.click(login);
    });
    const likes = await screen.findByText('Likes');
    await act(async () => {
      userEvent.click(likes);
    });
    await waitFor(() => { expect(screen.getByText(/empty likes\./i)).toBeInTheDocument(); });
  });

  test('Follows display', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    const email = screen.getByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    const login = screen.getByRole('button', { name: 'Sign in' });
    await act(async () => {
      userEvent.type(email, 'minzheng@seas.upenn.edu');
      userEvent.type(password, '123456');
      userEvent.click(login);
    });
    const follows = await screen.findByText('Follows');
    await act(async () => {
      userEvent.click(follows);
    });
    const element = await screen.findByText('Followings');
    await waitFor(() => { expect(element).toBeInTheDocument(); });
  });

  test('Profile display', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    const email = await screen.findByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    const login = screen.getByRole('button', { name: 'Sign in' });
    await act(async () => {
      userEvent.type(email, 'minzheng@seas.upenn.edu');
      userEvent.type(password, '123456');
      userEvent.click(login);
    });
    const profile = await screen.findByText(/profile/i);
    await act(async () => {
      userEvent.click(profile);
    });
    await waitFor(() => { expect(screen.getByText(/past/i)).toBeInTheDocument(); });
  });

  test('NewPost display', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    const email = await screen.findByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    const login = screen.getByRole('button', { name: 'Sign in' });
    await act(async () => {
      userEvent.type(email, 'minzheng@seas.upenn.edu');
      userEvent.type(password, '123456');
      userEvent.click(login);
    });
    const newPost = await screen.findByRole('button', {
      name: /new post/i,
    });
    await act(async () => {
      userEvent.click(newPost);
    });
    expect(await screen.findByRole('heading', { name: /photos\/videos display:/i })).toBeInTheDocument();
    expect(await screen.findByRole('textbox', { name: /tags/i })).toBeInTheDocument();
    const textbox = await screen.findByRole('textbox', { name: /tags/i });
    await act(async () => {
      userEvent.type(textbox, 'abc');
    });
    expect(textbox).toHaveValue('abc');
  });

  test('Post display', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/posts/1']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    const email = await screen.findByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    const login = screen.getByRole('button', { name: 'Sign in' });
    await act(async () => {
      userEvent.type(email, 'minzheng@seas.upenn.edu');
      userEvent.type(password, '123456');
      userEvent.click(login);
    });
    const title = await screen.findByRole('heading', { name: /us senate candidate, pa/i });
    const tags = await screen.findByRole('heading', { name: /tags/i });
    await waitFor(() => { expect(title).toBeInTheDocument(); });
    await waitFor(() => { expect(tags).toBeInTheDocument(); });
  });

  test('Add comment', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/posts/1']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    const email = await screen.findByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    const login = screen.getByRole('button', { name: 'Sign in' });
    await act(async () => {
      userEvent.type(email, 'minzheng@seas.upenn.edu');
      userEvent.type(password, '123456');
      userEvent.click(login);
    });
    const textArea = await screen.findByRole('textbox', { name: /add a comment/i });
    const comment = await screen.findByRole('button', { name: /comment/i });
    await act(async () => {
      userEvent.type(textArea, 'abc');
      userEvent.click(comment);
    });
    const content = await screen.findAllByText(/abc/i);
    await waitFor(() => { expect(content[0]).toBeInTheDocument(); });
  });

  test('Edit post', async () => {
    const store = configureStore({ reducer: rootReducer });
    await act(async () => {
      render(
        <Provider store={store}>
          <Router initialEntries={['/posts/b06d8d5c-be0a-4a46-a228-c56a8e60e03b']}>
            <App />
            ,
          </Router>
          ,
        </Provider>,
      );
    });
    const email = await screen.findByPlaceholderText('Email');
    const password = screen.getByPlaceholderText('Password');
    const login = screen.getByRole('button', { name: 'Sign in' });
    await act(async () => {
      userEvent.type(email, 'minzheng@seas.upenn.edu');
      userEvent.type(password, '123456');
      userEvent.click(login);
    });
    const edit = await screen.findAllByRole('button', { name: /edit/i });
    await act(async () => {
      userEvent.click(edit[0]);
    });
    const display = await screen.findByRole('heading', { name: /photos\/videos display:/i });
    await waitFor(() => { expect(display).toBeInTheDocument(); });
    await screen.findByRole('button', { name: /comment/i });
    // await screen.findByText(/commented/i);
    const edit1 = await screen.findAllByRole('button', { name: /edit/i });
    await act(async () => {
      userEvent.click(edit1[0]);
    });
  });
});

const MockAdapter = require('axios-mock-adapter');
const lib = require('./api/api_calls');

describe('Mock Api calls', () => {
  let mock;
  beforeAll(() => {
    const a = axios.create();
    mock = new MockAdapter(a);
    // global.axios = a;
  });

  afterEach(() => {
    mock.reset();
  });
  test('get all users', async () => {
    const users = [
      {
        id: 3,
        userId: 3,
        username: 'minzhengz',
        userEmail: 'minzheng@seas.upenn.edu',
        password: '123456',
        avatar: 'https://avatars.steamstatic.com/4bf1dcdd68bb15accde4d580690c27736d4872cb_full.jpg',
      },
      {
        id: 4,
        userId: 4,
        username: 'zijianx',
        userEmail: 'zijianx@upenn.edu',
        password: '123',
        avatar: 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/1406990/01416ca418934ca4bb9ae088b3bbab00cf21096d.gif',
      },
      {
        id: 1,
        userId: 1,
        username: 'silvialang',
        userEmail: 'silvia@upenn.edu',
        password: 'silvia123',
        avatar: 'https://images.unsplash.com/photo-1501644898242-cfea317d7faf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
      },
      {
        id: 2,
        userId: 2,
        username: 'JasonBaker',
        userEmail: 'test1@upenn.edu',
        password: 'JasonBKR',
        avatar: 'https://avatars.steamstatic.com/5bae9284ad8debd51e26acda3cac476b338a8a7e_full.jpg',
      },
      {
        id: 5,
        userId: 5,
        username: 'Dolores Walters',
        userEmail: 'test2@123.com',
        password: 'LjmX6XP6A4AJdZz',
        avatar: 'https://avatars.steamstatic.com/19469bf12d6cfb310a6911c8cb0a6c51715cf0f2_full.jpg',
      },
      {
        id: 6,
        userId: 6,
        username: 'Anne Collins',
        userEmail: 'test3@123.com',
        password: '123456',
        avatar: 'https://plus.unsplash.com/premium_photo-1661475871391-cc7652c61b4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzF8fHdvbWFufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
      },
      {
        id: 7,
        userId: 7,
        username: 'Brooke Osborne',
        userEmail: 'test3@123.com',
        password: '123456',
        avatar: 'https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjh8fG1hbnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60',
      },
      {
        userId: 8,
        username: 'Julius Webster',
        userEmail: 'test4@123.com',
        password: '123456',
        id: 8,
        avatar: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
      },
      {
        id: 9,
        userId: 9,
        username: 'Clifford Spencer',
        userEmail: 'test7@123.com',
        password: '123456',
        avatar: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1065&q=80',
      },
      {
        userId: '98f177ee-8002-4fe5-9d62-49969a4cb623',
        username: 'minzheng@seas.upenn.edu',
        password: '123456',
        avatar: 'https://avatars.steamstatic.com/4bf1dcdd68bb15accde4d580690c27736d4872cb_full.jpg',
        id: 10,
      },
      {
        userId: 'c62bf6c5-efbe-475f-91e3-068c75f4e628',
        username: 'minzheng@seas.upenn.edu',
        password: '123456',
        avatar: 'https://avatars.steamstatic.com/4bf1dcdd68bb15accde4d580690c27736d4872cb_full.jpg',
        id: 11,
      },
      {
        userId: 'e888472a-ff74-4252-b9ee-72592a2227f0',
        avatar: 'https://avatars.steamstatic.com/4bf1dcdd68bb15accde4d580690c27736d4872cb_full.jpg',
        id: 12,
      },
      {
        userId: '87d67b3d-be5d-4d3e-88a9-c42e36ae2413',
        avatar: 'https://avatars.steamstatic.com/4bf1dcdd68bb15accde4d580690c27736d4872cb_full.jpg',
        id: 13,
      },
      {
        userId: '7dfc4ed8-cdcf-4747-bcf7-36923b669a59',
        avatar: 'https://avatars.steamstatic.com/4bf1dcdd68bb15accde4d580690c27736d4872cb_full.jpg',
        id: 14,
      },
      {
        userId: 'd9b51955-4d5c-49a4-9c8e-f35f1184127e',
        username: 'minzheng@seas.upenn.edu',
        password: '123456',
        avatar: 'https://avatars.steamstatic.com/4bf1dcdd68bb15accde4d580690c27736d4872cb_full.jpg',
        id: 15,
      },
      {
        userId: '7e81ee61-7ba7-48c2-b751-4224f827255a',
        avatar: 'https://avatars.steamstatic.com/4bf1dcdd68bb15accde4d580690c27736d4872cb_full.jpg',
        id: 16,
      },
    ];
    mock.onGet().reply(200, users);
    const res = await lib.getAllUsers();
    expect(JSON.stringify(res) === JSON.stringify(users));
  });

  test('get user by userId', async () => {
    const user = {
      id: 1,
      userId: 1,
      username: 'silvialang',
      userEmail: 'silvia@upenn.edu',
      password: 'silvia123',
      avatar: 'https://images.unsplash.com/photo-1501644898242-cfea317d7faf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    };
    mock.onGet().reply(200, user);
    const res = await lib.getUserByUserId(1);
    expect(res === user);
  });

  test('get post by postId', async () => {
    const post = {
      id: 3,
      userId: 1,
      postId: 3,
      tags: [
        'life',
        'work',
      ],
      timeStamp: '2022-10-17T06:32:00.973Z',
      postContent: {
        photos: [
          {
            id: '1vjdqw546ckeqwewqe',
            src: 'https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(70).webp',
          },
          {
            id: '123125lcjsaddffohu',
            src: 'https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(72).webp',
          },
        ],
        videos: [],
        title: 'US Senate candidate, PA',
        text: 'Solidarity with PMA_Union on strike. Every philamuseum employee deserves respect, fair pay, and affordable health care. What goes great with some of the very best art in the world? A Union 💯 ',
      },
      comments: [],
    };
    mock.onGet().reply(200, post);
    const res = await lib.getPostByPostId(3);
    expect(res === post);
  });

  test('get follows by follower Id', async () => {
    const follows = [{
      id: 1,
      followId: 1,
      followerId: 1,
      followeeId: 2,
      timeStamp: '2022-10-19T05:21:00.973Z',
    },
    {
      id: 'fd45caef-6e67-48d7-94dc-89a3331598c5',
      followId: 'fd45caef-6e67-48d7-94dc-89a3331598c5',
      followerId: 1,
      followeeId: 3,
      timeStamp: '2022-10-21T23:27:17.125Z',
    }];
    mock.onGet().reply(200, follows);
    const res = lib.getFollowsByFollowerId(1);
    expect(JSON.stringify(res) === JSON.stringify(follows));
  });

  test('get follows by followee Id', async () => {
    const follows = [{
      id: '669e4343-d23a-4c86-b9fc-cae56e23f814',
      followId: '669e4343-d23a-4c86-b9fc-cae56e23f814',
      followerId: 3,
      followeeId: 5,
      timeStamp: '2022-11-07T01:27:12.939Z',
    }];
    mock.onGet().reply(200, follows);
    const res = lib.getFollowsByFolloweeId(5);
    expect(JSON.stringify(res) === JSON.stringify(follows));
  });

  test('get likes by userId', async () => {
    const likes = [
      {
        id: '246b1f4b-0691-4bfa-ab87-2c49b95a524a',
        likeId: '246b1f4b-0691-4bfa-ab87-2c49b95a524a',
        type: 'post',
        userId: 3,
        postId: 2,
        timeStamp: 1667969839897,
      },
      {
        id: 'c21e17e9-a12d-4898-9ec4-69f747a33476',
        likeId: 'c21e17e9-a12d-4898-9ec4-69f747a33476',
        type: 'post',
        userId: 3,
        postId: 1,
        timeStamp: 1668020201068,
      },
      {
        id: '8c58336f-af47-46fc-b43f-cb61defdd804',
        likeId: '8c58336f-af47-46fc-b43f-cb61defdd804',
        type: 'post',
        userId: 3,
        postId: 'a216c273-32a1-45ae-b48b-d748c6dadbd8',
        timeStamp: 1668130929059,
      },
      {
        id: 'a85d1b33-057e-47e1-9f57-ae5a03e14d11',
        likeId: 'a85d1b33-057e-47e1-9f57-ae5a03e14d11',
        type: 'post',
        userId: 3,
        postId: 'c70cb766-05b3-4775-a4df-f3e231dc2557',
        timeStamp: 1668130939072,
      },
    ];
    mock.onGet().reply(200, likes);
    const res = lib.getLikesByUserId(3);
    expect(JSON.stringify(res) === JSON.stringify(likes));
  });

  test('get comments by postId', async () => {
    const comments = [
      {
        id: 4,
        userId: 1,
        postId: '521bef8b-d3ec-4199-8ec8-4bc06948c017',
        commentId: 4,
        timeStamp: 1667378696801,
        content: 'What a nice trip! Enjoy your time!',
        comments: [],
      },
      {
        id: 5,
        userId: 4,
        postId: '521bef8b-d3ec-4199-8ec8-4bc06948c017',
        commentId: 5,
        timeStamp: 1667477696801,
        content: 'Beautiful!',
        comments: [],
      },
      {
        id: 6,
        userId: 5,
        postId: '521bef8b-d3ec-4199-8ec8-4bc06948c017',
        commentId: 6,
        timeStamp: 1667677337421,
        content: 'I like it!',
        comments: [
          1,
          2,
          3,
          4,
          5,
          6,
        ],
      },
    ];
    mock.onGet().reply(200, comments);
    const res = lib.getCommentsByPostId('521bef8b-d3ec-4199-8ec8-4bc06948c017');
    expect(JSON.stringify(res) === JSON.stringify(comments));
  });
});
