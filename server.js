const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');


// requerie  Routes
const usersRoutes = require('./routes/api/users');
const profileRoutes = require('./routes/api/profile');
const postsRoutes = require('./routes/api/posts');

// requerie models for setting up  SQL relations 
const User = require('./models/User');
const Profile = require('./models/Profile');
const Post = require('./models/Post');
const Like = require('./models/Like');
const Comment = require('./models/Comment');

// set up express
const app = express();

// set up bodyparser and static folders
app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')));


// Set up Headers Access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./util/passport')(passport);

// Use Routes
app.use('/users', usersRoutes);
app.use('/profile', profileRoutes);
app.use('/posts', postsRoutes);

// Set up relations for MySQL
User.hasOne(Profile);
User.hasMany(Post);
Profile.hasMany(Post);
User.hasMany(Like);
Post.hasMany(Like);
User.hasMany(Comment);
Profile.hasMany(Comment);
Post.hasMany(Comment);

// listening to the port
const port = process.env.PORT || 5000;

app.listen(port);