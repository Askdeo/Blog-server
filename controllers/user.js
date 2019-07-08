const sequelize = require('../util/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Load Input Validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const User = require('../models/User');

exports.userSignup = async (req, res, next) => {
    try {
        const { errors, isValid } = validateRegisterInput(req.body);
    // Check validation
    if(!isValid) {
        return res.status(422)
            .json(errors)
    }
    // console.log(isValid);

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const confirmedPassword = req.body.confirmedPassword;

    const hashedPassowrd = await bcrypt.hash(password, 12);
        const result = await  sequelize
            .sync()
            // .sync({force : true})
            
                    const user = await  User.findOne({ where: { email: email } })
                            if (password !== confirmedPassword) {
                                return res.status(422)
                                    .json({message: 'Passwords need to be equal'}) 
                            }
                            if(user) {
                                return res.status(422)
                                    .json({message: 'User with this email is already created'})
                            } 
                            const createdUser = await User.create({
                                name: name,
                                email: email,
                                password: hashedPassword,
                                avatar: 'images/dummy-avatar-300x300.jpg'
                            })
                            
                            res.status(200)
                                .json({message:'User created successfully', user: createdUser})
    
    
    }
    
        catch(error) {
            console.log(error);
        };
};

exports.userLogin = async (req, res, next) => {
    try{
        const { errors, isValid } = validateLoginInput(req.body);
        // Check validation
        if(!isValid) {
            return res.status(422)
                .json(errors)
        }
        const email = req.body.email;
        const password = req.body.password;
    
        const user = await User.findOne({where: {email: email}})
                if(!user) {
                    return res.status(404)
                        .json({message: 'User with this email does not exist'});
                }
                const isMatch = await bcrypt.compare(password, user.password)
                        if(!isMatch) {
                            return res.status(401)
                            .json({message: 'Wrong password'});
                        }
    
                        const payload = {
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };
    
                        const token = jwt.sign(
                            payload,
                            'secret',
                            { expiresIn: 3600 }
                        );
    
                        return res.status(200)
                            .json({
                                success: true,
                                token: 'Bearer ' + token
                            });
    }

        catch(err) {
            console.log(err)
            return res.status(400)
                .json({message: 'Could not login, please check your email and password combination'})
        }
};