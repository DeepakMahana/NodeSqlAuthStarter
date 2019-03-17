const { ExtractJwt, Strategy } = require('passport-jwt');
const { User }                 = require('../models');
const DATABASE                   = require('../config/database');
const {to}                     = require('../services/util.service');

module.exports = function(passport){
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = DATABASE.jwt_encryption;

    passport.use(new Strategy(opts, async function(jwt_payload, done){
        let err, user;
        [err, user] = await to(User.findByPk(jwt_payload.user_id));

        if(err) return done(err, false);
        if(user) {
            return done(null, user);
        }else{
            return done(null, false);
        }
    }));
}