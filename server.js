const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const usersRoutes = require('./routes/api/users');
const profileRoutes = require('./routes/api/profile');
const postsRoutes = require('./routes/api/posts');

const User = require('./models/User');
const Profile = require('./models/Profile');
const Post = require('./models/Post');
const Like = require('./models/Like');
const Comment = require('./models/Comment');

const app = express();

app.use(bodyParser.json()); // application/json
app.use('/images', express.static(path.join(__dirname, 'images')));


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
app.use('/api/users', usersRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postsRoutes);

User.hasOne(Profile);
Profile.belongsTo(User);
User.hasOne(Post);
Post.belongsTo(User);
Profile.hasOne(Post);
Post.belongsTo(Profile);
User.hasMany(Like);
Post.hasMany(Like);
User.hasMany(Comment);
Post.hasMany(Comment);

const port = process.env.PORT || 5000;

app.listen(port);