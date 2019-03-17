const bcrypt 			= require('bcryptjs');
const jwt           	= require('jsonwebtoken');
const {ThrowError, to}  = require('../services/util.service');
const DATABASE          = require('../config/database');

module.exports = (sequelize, DataTypes) => {

    var UserModel = sequelize.define('User', {

        name     : DataTypes.STRING,
        email     : {   type: DataTypes.STRING, 
                        allowNull: false, 
                        unique: true, 
                        validate: { isEmail: {msg: "Phone number invalid."}}
                    },
        phone     : {   type: DataTypes.STRING, 
                        allowNull: false, 
                        unique: true, 
                        validate: { len: {args: [7, 20], msg: "Phone number invalid, too short."}, 
                        isNumeric: { msg: "not a valid phone number."} }
                    },
        password  : DataTypes.STRING,
    },{
        
        freezeTableName: true

    });

    // UserModel.associate = function(models){
    //     this.Companies = this.belongsToMany(models.Company, {through: 'UserCompany'});
    // };

    UserModel.beforeSave(async (user, options) => {
        let err;
        if (user.changed('password')){
            let salt, hash
            [err, salt] = await to(bcrypt.genSalt(10));

            if(err){
                ThrowError(err.message, true);
            }

            [err, hash] = await to(bcrypt.hash(user.password, salt));
            if(err) {
                ThrowError(err.message, true);
            }

            user.password = hash;
        }
    });

    UserModel.prototype.comparePassword = async function (pw) {
        let err, pass
        if(!this.password){
            ThrowError('Password is Not Set');
        } 
        [err, pass] = await to(bcrypt.compare(pw, this.password));
        if(err){
            ThrowError(err);
        } 
        if(!pass){
            ThrowError('invalid password');
        } 
        return this;
    }

    UserModel.prototype.getJWT = function () {
        let expiration_time = parseInt(DATABASE.jwt_expiration);
        return "Bearer "+jwt.sign({user_id:this.id}, DATABASE.jwt_encryption, {expiresIn: expiration_time});
    };

    UserModel.prototype.toWeb = function () {
        let json = this.toJSON();
        return json;
    };

    return UserModel;
};
