const User = require('../models/User.model');
const bcrypt = require('bcryptjs');


const postLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({
            success: false,
            message: 'All fields are required!'
        })
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
        return res.status(401).json({
            success: false,
            message: 'No such user exists!'
        })
    } else {
        const passMatch = await bcrypt.compare(password, existingUser.password);
        if (passMatch) {
        existingUser.password = undefined;
            return res.status(200).json({
                success: true,
                message: 'Successfully logged in!',
                existingUser
            })
        } else {
            return res.status(401).json({
                success: true,
                message: 'Password did not match!',
            })
        }
    }
}


const postRegister = (req, res) => {
    const { firstname, lastname, email, password, confirm_password } = req.body;

    if (!firstname || !lastname || !email || !password || !confirm_password) {
        return res.status(401).json({
            success: false,
            message: " All fields are required!"
        })
    }
    
    if (password.length < 6) {
        return res.status(401).json({
            success: false,
            message: " Password must be at least 6 characters!"
        })
    }
    if (password !== confirm_password) {
        return res.status(401).json({
            success: false,
            message: " Passwords do not match. Please try again"
        });
    };

    //Create New User
    User.findOne({ email: email }).then((user) => {
        if (user) {
            return res.status(500).json({
                success: false,
                message: "User already exists with this email"
            })
        } else {
            bcrypt.genSalt(8, (err, salt) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "problem with generating salt"
                    })
                } else {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "problem with hashing"
                            })
                        } else {
                            const newUser = new User({
                                firstname,
                                lastname,
                                email,
                                password: hash,
                            });

                            newUser.save().then(() => {
                                res.status(201).json({
                                    success: true,
                                    message: " User created"
                                })
                            }).catch((err) => {
                                return res.status(500).json({
                                    success: false,
                                    message : "User Creation Failed"
                                })
                            })
                        }
                    })
                }
            })
        }
    })
}



module.exports = {
    postRegister,
    postLogin,
}