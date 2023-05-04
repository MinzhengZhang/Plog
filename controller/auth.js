// import jwt
const jwt = require('jsonwebtoken');

// import db interactions module
const dbLib = require('./dbFunctions');

/**
 * autenticate a use by decoding the JWT
 * @returns true if the user is valid
 * */
const authenticateUser = async (token, key) => {
  // check the params
  if (token === null || key === null || !key) {
    return false;
  }
  try {
    const decoded = jwt.verify(token, key);
    // verify the user - check password
    const user = await dbLib.getUserByEmail(decoded.userEmail);
    if (!user) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = { authenticateUser };
