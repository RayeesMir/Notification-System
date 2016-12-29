'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConnectedClientsSchema = new Schema({
    socketId: {
        type: String,
        required: [true, 'Username is required']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }

}, {timestamps: true});
/**
 *
 * @returns {Object|Promise|Array|{index: number, input: string}|*|{npmUpdate}}
 */
ConnectedClientsSchema.statics.findAllClients=function(){
    return this
        .find({user:user})
        .exec();
};
/**
 *
 * @param userId
 * @param socketId
 * @returns {Promise}
 */
ConnectedClientsSchema.statics.findClientBySocketId=function(userId,socketId){
    return this
        .findOne({user:userId,socketId:socketId})
        .exec();
};
/**
 *
 * @param socketId
 * @returns {Object|Promise|Array|{index: number, input: string}|*|{npmUpdate}}
 */
ConnectedClientsSchema.statics.removeClient=function(socketId){
    return this
        .remove({socketId:socketId})
        .exec();
};
/**
 *
 * @param userIds
 * @returns {Object|Promise|Array|{index: number, input: string}|*|{npmUpdate}}
 */
ConnectedClientsSchema.statics.findClientGroup=function(userIds){
    return this
        .find({user:{$in:userIds}})
        .exec();
};



module.exports = mongoose.model('ConnectedClients', ConnectedClientsSchema);

