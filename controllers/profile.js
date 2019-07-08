const Profile = require('../models/Profile');
const User = require('../models/User');
const validateProfileInput = require('../validation/profile');


const errors = {};

exports.getProfile = async (req, res, next) => {
    try{
        const profile = await Profile.findOne({ where: { userId: req.user.id } });
            if(!profile){
                errors.noprofile = 'There is no profile for this user';
                return res.status(404)
                    .json(errors);
            }
            return res.json(profile);
    }

            catch(error){
                console.log(error);
            }
};

exports.postProfile = async (req, res, next) => {
    try{
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
    
        const profile = await Profile.findOne({ where: { userId: req.user.id } })
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
    
                    const updatedProfile = await profile.save()
                            res.status(200)
                                .json({ message: 'profile updated successfully', profile: updatedProfile })
                }
    
                    // Save Profile
                    const createdProfile = await req.user.createProfile(profileFields);
                            res.status(200)
                                .json({message: "success", profile: createdProfile})
    
    }
    
        catch(error){
            console.log(error)
        };
        
}

exports.deleteProfileAndUser = async (req, res, next) => {
    try{
        const profile = await Profile.findOne({ where: { userId: req.user.id } })
        if(!profile) {
            return res.status(404)
                .json('There is no profile found')
        }
        const resultOfProfileDestroing = await  profile.destroy()
                const user = await User.findByPk(req.user.id)
                        if(!user) {
                            return res.status(404)
                                .json("There is no user found")
                        }
                        const resultOfUserDestroting = await user.destroy()
                                return res.status(200)
                                    .json('Profile and User were successfully deleted')
    }
    
            
    catch(error){
        console.log(error)
    }
}

exports.getAllProfiles = async (req, res, next) => {
    try{
        const profiles = await Profile.findAll()
        if(!profiles) {
            return res.status(404)
                .json("There are no profiles");
        }
        return res.status(200)
            .json(profiles);

    }
   
        catch(error) {
            console.log(error);
        };

};

exports.getUsersProfileById = async (req, res, next) => {
    try{
        const profile = await  Profile.findOne({ where : { id: req.params.user_id } });
            if(!profile) {
                res.status(404)
                    .json('There is no profile for this user');
            }
            res.json(profile);
    }
    
        catch(error) {
            console.log(error);
        };
};

