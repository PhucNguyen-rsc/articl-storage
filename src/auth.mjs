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
    if ((username.length < 8) || (password.length < 8)){
      throw ({message: 'USERNAME PASSWORD TOO SHORT'});
    }
    const foundUser = await User.findOne({username: username});
    if (foundUser){
      throw ({ message: 'USERNAME ALREADY EXISTS' });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({
      username: username,
      password: hash,
      email: email,
    });
    return newUser.save()
    .then((savedUser)=>{return savedUser;});
};

const login = async (username, password) => {

  // TODO: implement login
  // * find a user with a matching username
    const foundUser = await User.findOne({username: username});
    if (!foundUser){
      throw ({ message: "USER NOT FOUND" });
    }
    else{
      const hash = foundUser.password;
      const isMatch = await bcrypt.compare(password, hash);
      if (!isMatch){
        throw ({ message: "PASSWORDS DO NOT MATCH" });
      }
      else{
        return foundUser;
      }
    }
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login
};
