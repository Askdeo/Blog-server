const express = require('express');
const passport = require('passport');

const router = express.Router();

const postController = require('../../controllers/post');

router.get('/', postController.getPosts);

router.get('/:post_id', postController.getPost);

router.post('/',
    passport.authenticate('jwt', { session: false }),
    postController.createPost
);
router.delete('/:post_id', 
    passport.authenticate('jwt', { session: false }),
    postController.deletePost
);

router.post('/like/:id',
    passport.authenticate('jwt', { session: false }),
    postController.postLike
);

router.post('/unlike/:id',
    passport.authenticate('jwt', { session: false }),
    postController.postUnlike
);
router.post('/comment/:id',
    passport.authenticate('jwt', { session: false }),
    postController.postComment
);
router.delete('/comment/:commentId',
    passport.authenticate('jwt', { session: false }),
    postController.deleteComment
);

module.exports = router;