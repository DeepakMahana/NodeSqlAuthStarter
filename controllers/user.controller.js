const { User }          = require('../models');
const authService = require('../services/auth.service');
const { to, ResponseError, ResponseSuccess }  = require('../services/util.service');
const Joi           = require('joi');

module.exports.create = async function(req, res){

    const body = req.body;

    const schema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().regex(/^[6-9]\d{9}$/).required(),
        password: Joi.string().required() 
    });

    Joi.validate(body, schema, async (err, result) => {
        if(err){
            ThrowError('Validation Error', true);
        }else{
            let err, user;
            [err, user] = await to(authService.createUser(body));
            if(err) {
                return ResponseError(res, err, 422);
            } else {
                return ResponseSuccess(res, { message:'Successfully created new user.', 
                                        user:   user.toWeb(), 
                                        token:  user.getJWT()
                                      }, 201);
            }
        }
    });
       
}

module.exports.get = async function(req, res){
    let user = req.user;
    return ResponseSuccess(res, {user:user.toWeb()});
}

module.exports.update = async function(req, res){
    let err, user, data
    user = req.user;
    data = req.body;
    user.set(data);

    [err, user] = await to(user.save());
    if(err){
        if(err.message=='Validation error') err = 'The Email ID is already in use';
        return ResponseError(res, err);
    }
    return ResponseSuccess(res, {message :'Updated User: '+user.email});
}

module.exports.remove = async function(req, res){
    let user, err;
    user = req.user;

    [err, user] = await to(user.destroy());
    if(err){
        return ResponseError(res, 'error occured trying to delete user');
    } 
    return ResponseSuccess(res, {message:'Deleted User'}, 204);
}


module.exports.login = async function(req, res){
    const body = req.body;

    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required() 
    });

    Joi.validate(body, schema, async (err, result) => {
        if(err){
            ThrowError('Validation Error', true);
        } else {
            [err, user] = await to(authService.authUser(req.body));
            if(err) {
                return ResponseError(res, err, 422);
            } else {
                return ResponseSuccess(res, {token:user.getJWT(), user:user.toWeb()});
            }
        }
    });
    
}