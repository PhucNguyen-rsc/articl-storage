import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const User = mongoose.model('User');

const startAuthenticatedSession = (req, user) => {
  return new Promise((fulfill, reject) => {
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user = user; 
        fulfill(user);
      } else {
        reject(err);
      }
    });
  });
};

const endAuthenticatedSession = req => {
  return new Promise((fulfill, reject) => {
    req.session.destroy(err => err ? reject(err) : fulfill(null));
  });
};


const register = async (username, email, password) => {

  // TODO: implement registration (
  // * check if username and password are both greater than 8
  //   * if not, throw { message: 'USERNAME PASSWORD TOO SHORT' }
  // * check if user with same username already exists
  //   * if not, throw { message: 'USERNAME ALREADY EXISTS' }
  // * salt and hash using bcrypt's sync functions
  //   * https://www.npmjs.com/package/bcryptjs#usage---sync
  // * if registration is successfull, return the newly created user
  // return user;
};

const login = async (username, password) => {

  // TODO: implement login
  // * find a user with a matching username
  // * if username isn't found, throw { message: "USER NOT FOUND" }
  // * use bcrypt's sync functions to check if passwords match
  // * https://www.npmjs.com/package/bcryptjs#usage---sync
  // * if passwords mismatch, throw{ message: "PASSWORDS DO NOT MATCH" }
  // * however, if passwords match, return found user
  // return user;
};

export  {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login
};
