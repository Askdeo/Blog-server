const express = require('express');
const passport = require('passport');

const profileController = require('../../controllers/profile');
// Load Profile Model


const router = express.Router();


router.get('/',
    passport.authenticate('jwt', { session: false }),
    profileController.getProfile
)

router.post('/',
    passport.authenticate('jwt', { session: false }),
    profileController.postProfile
)
router.delete('/delete',
    passport.authenticate('jwt', { session: false }),
    profileController.deleteProfileAndUser
)

router.get('/all', profileController.getAllProfiles);

router.get('/user/:user_id', profileController.getUsersProfileById);


module.exports = router;