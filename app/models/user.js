'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({
    username: {
        type: String,
        trim: true,
        default: '',
        required: true
    },
    password: {
        type: String,
        default: '',
        required: true,
        minlength: 4,
        select: false
    },
    salt: {
        type: String,
        select: false,
        default: ''
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        default: '',
        match: /.+\@.+\..+/
    },
    // mobile: {
    //     type: String,
    //     unique: true,
    //     minlength: 10,
    //     maxlength: 10,
    //     trim: true,
    //     match: /^[789]\d{9}$/,
    //     required: true
    // },
    profileImageURL: {
        type: String,
        default: 'default.png'
    },
    subscribers: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref:'User'
        },
        fields: {
            type: Array,
            default: []
        }
    }],
    role: {
        type: String,
        select: false,
        enum: ['admin', 'user'],
        default: ['user'],
        required: 'Please provide at least one role'
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    }
}, {
    timestamps: true
});

UserSchema.pre('save', function(next) {
    if (this.password && this.isModified('password')) {
        this.salt = crypto.randomBytes(16).toString('base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

/**
 *
 * @param password
 * @returns {boolean}
 */

UserSchema.methods.authenticate = function(password) {
    return (this.password === this.hashPassword(password));
};

/***
 * @param password
 * @returns {*}
 */

UserSchema.methods.hashPassword = function(password) {
    if (password)
        return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
    return password;

};

/***
 *
 * @param email
 * @param mobile
 * @returns {Promise|MongoosePromise}
 * @memberOf UserModel
 */

UserSchema.statics.findUserByMobileAndEmail = function(email, mobile) {
    return this
        .findOne({
            $or: [{
                mobile: mobile
            }, {
                email: email
            }]
        })
        .exec();
};


/***
 * @param userEmail
 * @returns {Promise|MongoosePromise}
 */

UserSchema.statics.findUserByEmail = function(userEmail,fields) {
    return this
        .findOne({
            email: userEmail
        })
        .select(fields)
        .exec();
};

/**
 *
 * @param userId
 * @returns {MongoosePromise|Promise}
 * @memberOf UserModel
 */
UserSchema.statics.findUserById = function(userId) {
    return this
        .findOne({
            _id: userId
        })
        .exec()

};

/**
 *
 * @returns {*|MongoosePromise|Promise|Object|Array|{index: number, input: string}}
 * @memberOf UserModel
 */

UserSchema.statics.findAllUsers = function() {
    return this.find({})
            .populate([{
                        path:"subscribers.user",
                        model:"User"
                    }])
        // .select('+role')
        .exec();
};

/**
 * @param userId
 * @param updatedUser
 * @returns {Promise|MongoosePromise|Array|{index: number, input: string}}
 */

UserSchema.statics.updateUser = function(userId, updatedUser) {
    return this.findByIdAndUpdate(userId, updatedUser, {
            new: true,
            runValidators: true
        })
        .select('-__v')
        .exec()
};

/**
 * @param token
 * @returns {MongoosePromise|Promise}
 */

UserSchema.statics.getPasswordResetToken = function(token) {
    return this.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {
                $gt: Date.now()
            }
        })
        .exec();
};


UserSchema.statics.findSubscribers=function(user){
    return this
                .findOne({_id:user})
                .select("subscribers")
                .populate([{
                            path:"subscribers.user",
                            model:'User'
                        }])
                .exec();
};

UserSchema.statics.checkUserSubscription=function(following,subscriber){
    return this.findOne({_id:following,subscribers:{$elemMatch:{user:subscriber}}}).exec();
};

// UserSchema.statics.updateSubcription=function(user,subscriber,fields){
//     return this.update({_id:user,"subscribers.user":subscriber},{$set:{"subscribers.0.fields":fields}}).exec();
// };



module.exports = mongoose.model('User', UserSchema);