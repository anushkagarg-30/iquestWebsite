const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registration = new Schema({
   name:String,
   email:String,
   regNo:String,
   phoneNo:Number
});

module.exports = mongoose.model('registration',registration);