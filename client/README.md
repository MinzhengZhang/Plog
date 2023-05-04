## Assignment #3 Progress Update and Notes: 
In Assignment #3, we have created React components for the required features. We have also mocked the backend for these features, but due to time limitation, only selected components are interactive with the mocked backend. Please see notes below for where to find these interactive components.
0. Our pages currently does not support save state on web storage, so if you type URL directly or refresh page, it will lose all states(including login status), which will direct to Login Page.
1. User can register an account in the "/register" page, which sends a POST request to JSON-server, but for the time being, there is no front-end notification for status of the registration. In future iterations, we plan to display a message indicating whether the registration is successful. 
2. User log in sends a POST request to JSON-server. However, our web application currently only supports one test user log in. The credentials are 

   > Email: minzheng@seas.upenn.edu
   >
   > Password: 123456
3. User profile page is available from the NavBar on the left. It sends a GET request to get data from JSON-server and displays past posts of the user. 
4. CREATE POST is available from the NavBar on the left. It sends a POST request to JSON-server. Now user can create their posts and see their post in their Profile page(available from the left NavBar). 
5. Activity feeds is available after log in. It sends a GET request to get posts of followed users. 
6. Following/unfollowing users sends a POST/DELETE request to JSON-server, but this feature is only accessible from the Feeds page for the time being. By default, the Feeds page has posts of followed users, so :white_check_mark: is displayed next to username. Clicking the :white_check_mark: will unfollow the user, and the icon will turn into :heavy_plus_sign:, which means the user is not followed (and available to be followed).

### HW 3 new Features:
7. Now Users can like and unlike both posts and comments by clicking icon ♥️, and for liked posts they can find their likes history in the likes page.
8. Now Users can comment posts and comments. We have two mode of comments. 
   - One is called QuickComment, which users can click the comment icon 💬 that is next to the likes icon ♥️. QuickComment supports reply to comment and post, but not support @ mentions and user need to send comment by clicking the button rather than pressing enter.
   - Another comment is the Main Comment Component, it is in the post page(you can randomly go to a single post), where users can comment on Post and mentions @other users. 
10. Now Users can get their follower suggestions in the homepage and choose whether to follow them. 
11. User can click a post and edit or delete it if the user is the creator of that post. Also, user can edit and delete their own comment by just clicking edit button. 
12. We implemented @mentions in the comment Component, users can go to a random post page and users can now comment in the comment tables and @ other users.
13. Notification and other functionalities which are not in requirement of HW3 are still not implemented.  
Below is the test for hw3:

![image](https://user-images.githubusercontent.com/90017890/201433195-e9c6a3a7-b42c-45cd-8456-9a0c6e3eb6c8.png)



 ## Table of Contents
- [Available Scripts](#available-scripts)
- [About this Project](#about-this-project)
- [User Story](#user-story)
- [Design of this Project](#design-of-this-project)
  * [UI/UX Design](#ui-ux-design)
  * [API Design](#api-design)

## Available Scripts
This project was bootstrapped with Create React App. In the project directory, you can run:

 ### `npm install`

Install relevant packages for the application.\
 
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`
To pass all the test, please start json-server first: type `npx json-server --watch data/db.json --port 8000` in the command line in project folder
Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npx json-server --watch data/db.json --port 8000`

Launches JSON-server.\
Open [http://localhost:8000](http://localhost:8000) to view it in your browser. Current endpoints include '/users', '/logins', '/posts', '/follows', '/likes', and '/comments'.


## About this Project
This is a semester-long project for *CIS 557 Programming for the Web* and by Zijian Xiao, Siting Lang, and Minzheng Zhang.
This project designs and implements a photo and video sharing web application called Plog.  

## User Story
Users can perform the following actions in the app:
* As a user, I can create a new account.(User registration).
* As a user, I can login with my account.(Login Auth).
* As a user, I can retrieve my password if I forgot password.(User findback password).
* As a user, I can check my own user profile and others user profiles.
* As a user, I can edit my user profile such as profile image, profile background.
* As a user, I can create posts with photos and videos, edit, update, delete posts, add tags and mention other users in posts, and modifying privacy/visibility settings in my posts. 
* As a user, I can see other users' activity feeds in my homepage.
* As a user, I can see live/message update in my homepage.
* As a user, I can like or unlike a post.
* As a user, I can follow and unfollow another user.
* As a user, I can comment a post, mention someone in comments, edit my comments, and view others' comments.
* As a user, I can get follower suggestions and follow the suggested users.
 




## Design of this Project
### UI/UX Design
We performed the frontend UI/UX design on Figma. The link to our design page is as follows.

[UI design on Figma (Wireframes & Prototypes)](https://www.figma.com/file/f863xzetVuMT30SuBfBEQy/Profile?node-id=0%3A1)

### API Design
We followed the Rest API conventions when designing the backend API. Below is the link to our Swagger design page.

[Swagger API documentation](https://app.swaggerhub.com/apis/KEVIN4977_1/Plog_API/1.0.0#/tags)



