const Profile = require('../models/Profile');
const User = require('../models/User');
const Post = require('../models/Post');
const Like = require('../models/Like');
const Comment = require('../models/Comment');

// Validation
const validatePostInput = require('../validation/post');

exports.getPosts = async (req, res, next) => {
    try {
        const posts = await Post.findAll();
        if(!posts) {
            return res.status(404)
                .json({message: 'There are no posts'})
        }
        return res.status(200)
            .json(posts);
    }
    catch(error) {
        res.status(500)
            .json(error)
    }
};
exports.getPost = async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.post_id}})
        if(!post) {
            return res.status(404)
                .json({message: 'There are no posts with this id'})
        }
        return res.status(200)
            .json(post);
    }

    catch(error) {
        console.log(error);
    };
};

exports.deletePost = async (req, res, next) => {
    try{
        const post = await Post.findByPk(req.params.post_id)
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
    }
       
        catch(error) {
            console.log(error)
        }
};


exports.createPost = async (req, res, next) => {
    try{
        const { errors, isValid } = validatePostInput(req.body);

        if(!isValid) {
            return res.status(400)
                .json(errors);
        };
    
        const post = await req.user.createPost({
                text: req.body.text,
                name: req.user.name,
                avatar: req.user.avatar
        })
            res.status(200)
                .json(post)
    }
   
    catch(error){
        console.log(error)
    }
};

exports.postLike = async (req, res, next) => {
    try {
        const post = await Post.findByPk(req.params.id)

        if(!post) {
            return res.status(404)
                .json('There is no post with this id')
        }

        const like = await Like.findOne({ where: { userId: req.user.id, postId: post.id}})
                    if(like) {
                        return res.status(400)
                            .json('User already liked this post');
                    };
                const createdLike = await req.user.createLike({
                    postId: post.id
                })
                    
                        res.status(200)
                        .json('Like created');
    }
    catch(error) {
        console.log(error);
    }
};

exports.postUnlike = async (req, res, next) => {
    try{
        const post = await Post.findByPk(req.params.id);
        if(!post) {
            return res.status(404)
                .json('There is no post with this id')
        }
        const like = await Like.findOne({ where: { userId: req.user.id, postId: post.id}});
                if(!like) {
                    return res.status(404)
                        .json("This user didn't like this yet")
                }
                const result = await like.destroy()
                        return res.status(200)
                            .json('The like was taken back')
    }
        
    catch(error){
        console.log(error);
    }
};

exports.postComment = async (req, res, next) => {
    try{
        const { errors, isValid } = validatePostInput(req.body);

        if(!isValid) {
            return res.status(400)
                .json(errors);
        };
        const post = await Post.findByPk(req.params.id)
                if(!post) {
                    return res.status(404)
                        .json('There is no post was found');
                }
                const comment = await req.user.createComment({
                        text: req.body.text,
                        name: req.user.name,
                        avatar: req.user.avatar,
                        postId: post.id
                    })
                        
                            return res.status(200)
                                .json({comment: comment, message: 'comment was created'});
    }
    

        catch(error){
            console.log(error);
        }
};
exports.deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findByPk(req.params.commentId)

        if(!comment) {
            return res.status(404)
                .json('Comment not found')
        }
         if(req.user.id !== comment.userId) {
            return res.status(400)
                .json('Only user who created the comment can delete it.')
         }
         const result = await comment.destroy()
                return res.status(200)
                    .json('The comment has been deleted');
    
    }
           
        catch(error){
            console.log(error);
        }
};