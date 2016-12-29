'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ActivitySchema = new Schema({
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'User',
    required: [true, 'Username is required']

  },  
  name: {
    type: String,
    required: [true, 'Username is required']
  },
  post: {
    type: String
  }

},{timestamps:true});
/**
 *
 * @param user
 * @returns {Object|Promise|Array|{index: number, input: string}|*|{npmUpdate}}
 */
ActivitySchema.statics.findAllActivitiesOfUser=function(user){
    return this
                .find({user:user})
                .exec();
};


module.exports = mongoose.model('Activity', ActivitySchema);