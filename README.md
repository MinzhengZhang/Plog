## Assignment #4 Progress Update and Notes: 
To run this project, you need to build two js files. One is called dbConfig.js which is directly under controller folder.
Another is called s3Config.js, which is under client/src folder. 

For dbConfig.js file, the file structure is like this: 

![image](https://user-images.githubusercontent.com/90017890/205550593-b055ebdf-a98f-44c3-8c67-0b535d6afb12.png)

For s3Config.js, the file structure is like this:

![image](https://user-images.githubusercontent.com/90017890/205550664-8566224f-5e35-4a17-9a5a-bc086586fc4b.png)


In Assignment #4, we completed the front- and back-end implementation for some of the features. Below is the list of fully implemented features.

1. User can register an account in the "/register" page, which sends a POST request to the back-end. After submitting the form, users will be able to see text indicative of the registration result. 
2. User log in sends a POST request to the backend, which then returns a token stored in session storage. 
3. User profile page is available from the NavBar on the left. It sends a GET request to get data from the back-end and displays past posts of the user. 
4. Creat post is available from the NavBar on the left. It sends a POST request to the backend. 
5. Activity feeds is available after logging in. It sends a GET request to get posts of followed users by default. However, for recently registered users who have not followed any other user, the system randomly displays feeds in the system as a starting point. 
6. Following/unfollowing users sends a POST/DELETE request to the backend. This feature is available in feeds next to user name. For new users who have not followed any other user, the icon next to user name in their feeds are displayed as :heavy_plus_sign:, which means the user is not followed. Clicking on the icon will trigger following the user, and the icon will turn into :white_check_mark:, which means means already followed. Clicking it again will trigger unfollowing the user. 

Please note the following features have not been fully implemented although their static components may be displayed. 
1. Like/unlike post and the "Likes" section on NavBar.
2. User suggestions in the "You may like" section.

 ## Table of Contents
- [Available Scripts in the Front End](#available-scripts-in-the-front-end)
- [Available Scripts in the Back End](#available-scripts-in-the-back-end)
- [About this Project](#about-this-project)
- [User Story](#user-story)
- [Design of this Project](#design-of-this-project)
  * [UI/UX Design](#ui/ux-design)
  * [API Design](#api-design)

## Available Scripts in the Front-end
This project was bootstrapped with Create React App. In the "Client" folder, you can run:

 ### `npm install`

Install relevant packages for the application.
 
### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### `npm test`
Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Available Scripts in the Back-end
In the "Controller" folder, you can run:

 ### `npm install`

Install relevant packages for the application.
 
### `npm start`

Runs the app in the development mode.
Open [http://localhost:8080](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### `npm test`
To pass all the test, please start json-server first: type `npx json-server --watch data/db.json --port 8000` in the command line in project folder
Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.


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



