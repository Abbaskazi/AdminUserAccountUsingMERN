const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true , unique: true},
    age: {type:String, required: true},
    gender: {type:String , required: true},
    password : {type: String, required: true},
},{collection: "UserAuthData"})

const AdimModel = mongoose.model('UserData',UserSchema)

module.exports = AdimModel