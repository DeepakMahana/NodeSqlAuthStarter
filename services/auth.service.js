const { User }      = require('../models');
const { to, ThrowError }    = require('../services/util.service');


// Register A User
module.exports.createUser = async (userInfo) => {

    // Insert into DB
    [err, user] = await to(User.create(userInfo));
    if(err){
        ThrowError('User Already Exist with the Email id');
    } else {
        return user;
    }
        
}

// Authenticate User by Comparing Passwords
module.exports.authUser = async (userInfo) => {
    let err, user;
    [err, user] = await to(User.findOne({where:{email:userInfo.email}}));
    if(err){
        ThrowError('Didnt find User with this Email ID');
    } else {
        [err, user] = await to(user.comparePassword(userInfo.password));
        if(err){
            ThrowError(err.message);
        }
        return user;
    }
}