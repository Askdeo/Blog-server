const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');

// Validation
const validatePostInput = require('../validation/post');

exports.getPosts = (req, res, next) => {
    Post.findAll()
        .then(posts => {
            if(!posts) {
                return res.status(404)
                    .json({message: 'There are no posts'})
            }
            return res.status(200)
                .json(posts);
        })
        .catch(err => console.log(err));
};
exports.getPost = (req, res, next) => {
    Post.findOne({ where: { id: req.params.post_id}})
        .then(post => {
            if(!post) {
                return res.status(404)
                    .json({message: 'There are no posts with this id'})
            }
            return res.status(200)
                .json(post);
        })
        .catch(err => console.log(err));
};

exports.deletePost = (req, res, next) => {
    Post.findByPk(req.params.post_id)
        .then(post => {
            if(!post) {
                return res.status(404)
                    .json('Post with this id is not found');
            };
            if(post.userId !== req.user.id) {
                return res.status(401)
                    .json("User not authorized");
            };
            post.destroy()
                .then(result => {
                    return res.status(200)
                        .json('Successufully deleted post')
                });
        })
        .catch(err => console.log(err));
};


exports.createPost = (req, res, next) => {
    const { errors, isValid } = validatePostInput(req.body);

    if(!isValid) {
        return res.status(400)
            .json(errors);
    };

    return req.user.createPost({
            text: req.body.text,
            name: req.user.name,
            avatar: req.user.avatar
    })
    .then(post => {
        res.status(200)
            .json(post)
    })
    .catch(err => console.log(err));
};

exports.postLike = (req, res, next) => {
    Post.findByPk(req.params.id)
        .then(post => {
            if(!post) {
                return res.status(404)
                    .json('There is no post with this id')
            }
            Like.findOne({ where: { userId: req.user.id, postId: post.id}})
                .then(like => {
                    if(like) {
                        return res.status(400)
                            .json('User already liked this post');
                    };
                    req.user.createLike({
                        postId: post.id
                    })
                    .then(like => {
                        res.status(200)
                        .json('Like created');
                    })

                })
                .catch(err => console.log(err));
         });
};

exports.postUnlike = (req, res, next) => {
    Post.findByPk(req.params.id)
        .then(post => {
            if(!post) {
                return res.status(404)
                    .json('There is no post with this id')
            }
            Like.findOne({ where: { userId: req.user.id, postId: post.id}})
                .then(like => {
                    if(!like) {
                        return res.status(404)
                            .json("This user didn't like this yet")
                    }
                    like.destroy()
                        .then(result => {
                            return res.status(200)
                                .json('The like was taken back')
                        })
                })
                
        })
        .catch(err => console.log(err));
};

exports.postComment = (req, res, next) => {
    const { errors, isValid } = validatePostInput(req.body);

    if(!isValid) {
        return res.status(400)
            .json(errors);
    };
    Post.findByPk(req.params.id)
        .then(post => {
            if(!post) {
                return res.status(404)
                    .json('There is no post was found');
            }
            return req.user.createComment({
                    text: req.body.text,
                    name: req.user.name,
                    avatar: req.user.avatar,
                    postId: post.id
                })
                    .then(comment => {
                        return res.status(200)
                            .json({comment: comment, message: 'comment was created'})
                    });

        })
        .catch(err => console.log(err));
};
exports.deleteComment = (req, res, next) => {
    
            Comment.findByPk(req.params.commentId)

            .then(comment => {
                if(!comment) {
                    return res.status(404)
                        .json('Comment not found')
                }
                 if(req.user.id !== comment.userId) {
                    return res.status(400)
                        .json('Only user who created the comment can delete it.')
                 }
                 return comment.destroy()
                    .then(result => {
                        return res.status(200)
                            .json('The comment has been deleted')
                    });
            
        })
        .catch(err => console.log(err))
};