const Profile = require('../models/Profile');
const User = require('../models/User');
const validateProfileInput = require('../validation/profile');


const errors = {};

exports.getProfile = (req, res, next) => {
    Profile.findOne({ where: { userId: req.user.id } })
        .then(profile => {
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404)
                    .json(errors);
            }
            return res.json(profile);
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postProfile = (req, res, next) => {
    const { errors, isValid } = validateProfileInput(req.body);
    
    // Check validation
    if(!isValid) {
        return res.status(400)
            .json(errors);
    }
    console.log(req.file);
    //Get fields
    const profileFields = {};
    profileFields.name = req.user.name;
    // profileFields.avatar = req.file;
    profileFields.user = req.user.id;
    if(req.body.sex) profileFields.sex = req.body.sex;
    if(req.body.relation) profileFields.relation = req.body.relation;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.languages) profileFields.languages = req.body.languages;
    if(req.body.education) profileFields.education = req.body.education;
    if(req.body.job) profileFields.job = req.body.job;
    if(req.body.bio) profileFields.bio = req.body.bio;

    Profile.findOne({ where: { userId: req.user.id } })
        .then(profile => {
            console.log(req.user);
            //Update
            if(profile) {
               profile.sex = profileFields.sex;
               profile.relation = profileFields.relation;
               profile.location = profileFields.location;
               profile.languages = profileFields.languages;
               profile.education = profileFields.education;
               profile.job = profileFields.job;
               profile.bio = profileFields.bio;

                return profile.save()
                    .then(profile => {
                        res.status(200)
                            .json({ message: 'profile updated successfully', profile: profile })
                    })
            }

                // Save Profile
                return req.user.createProfile(profileFields)
                    .then(profile => {
                        res.status(200)
                            .json({message: "success", profile: profile})
                    })

        })
        .catch(err => console.log(err));
        
}

exports.deleteProfileAndUser = (req, res, next) => {
    Profile.findOne({ where: { userId: req.user.id } })
    .then((profile) => {
        if(!profile) {
            return res.status(404)
                .json('There is no profile found')
        }
        return profile.destroy()
            .then(result => {
                User.findByPk(req.user.id)
                    .then(user => {
                        if(!user) {
                            return res.status(404)
                                .json("There is no user found")
                        }
                        return user.destroy()
                            .then(result => {
                                return res.status(200)
                                    .json('Profile and User were successfully deleted')
                            });
                    });
            });
            
    })
    .catch(err => console.log(err));
}

exports.getAllProfiles = (req, res, next) =>{
    Profile.findAll()
        .then(profiles => {
            if(!profiles) {
                return res.status(404)
                    .json("There are no profiles");
            }
            return res.status(200)
                .json(profiles);
        })
        .catch(err => console.log(err));

};

exports.getUsersProfileById = (req, res, next) => {
    Profile.findOne({ where : { id: req.params.user_id } })
        .then(profile => {
            if(!profile) {
                res.status(404)
                    .json('There is no profile for this user');
            }
            res.json(profile);
        })
        .catch(err=> console.log(err));
};

