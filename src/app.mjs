import './config.mjs';
import './db.mjs';
import mongoose from 'mongoose';
import sanitize from 'mongo-sanitize';

import express from 'express';
import session from 'express-session';
import path from 'path';
import url from 'url';
import * as auth from './auth.mjs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));

const Article = mongoose.model('Article');

const authRequiredPaths = ['/article/add'];

const loginMessages = {"PASSWORDS DO NOT MATCH": 'Incorrect password', "USER NOT FOUND": 'User doesn\'t exist'};
const registrationMessages = {"USERNAME ALREADY EXISTS": "Username already exists", "USERNAME PASSWORD TOO SHORT": "Username or password is too short"};

app.use((req, res, next) => {
  if(authRequiredPaths.includes(req.path)) {
    if(!req.session.user) {
      res.redirect('/login'); 
    } else {
      next(); 
    }
  } else {
    next(); 
  }
});

app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use((req, res, next) => {
  console.log(req.path.toUpperCase(), req.body);
  next();
});

app.get('/', async (req, res) => {
  const articles = await Article.find({}).sort('-createdAt').exec();
  res.render('index', {user: req.session.user, home: true, articles: articles});
});

app.get('/article/add', (req, res) => {
  res.render('article-add');
});

app.post('/article/add', async (req, res) => {
  const article = new Article({
    title: sanitize(req.body.title), 
    url: sanitize(req.body.url), 
    description: sanitize(req.body.description),
    user: req.session.user._id
  });
  try {
    await article.save();
    res.redirect('/'); 
  } catch(err) {
    res.render('article-add', {message: err.message});
  }
});

// TODO: respond to GET requests for a specific articl
// * path is /article/name-of-article-as-slug
//   * where name-of-article-as-slug will vary
// * use path parameters to do this
// * find the article using the `findOne`
// * use populate to get the related user info 
//   * (note that referenced models are used)
// * when found, render the article-detail handlebars file
// * set the template variable to the found user when rednering


// end TODO

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  try {
    const newUser = await auth.register(
      sanitize(req.body.username), 
      sanitize(req.body.email), 
      req.body.password
    );
    await auth.startAuthenticatedSession(req, newUser);
    res.redirect('/'); 
  } catch(err) {
    console.log(err);
    res.render('register', {message: registrationMessages[err.message] ?? 'Registration error'}); 
  }
});
        
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
  try {
    const user = await auth.login(
      sanitize(req.body.username), 
      req.body.password
    );
    await auth.startAuthenticatedSession(req, user);
    res.redirect('/'); 
  } catch(err) {
    console.log(err)
    res.render('login', {message: loginMessages[err.message] ?? 'Login unsuccessful'}); 
  }
});

app.listen(process.env.PORT ?? 3000);
