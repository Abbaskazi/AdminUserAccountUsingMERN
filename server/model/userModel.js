const mongoose = require('mongoose')

const AdimSchema = new mongoose.Schema({
    name : {type: String, required: true},
    email : {type: String, required: true , unique: true},
    age: {type:String, required: true},
    gender: {type:String , required: true},
    password : {type: String, required: true},
},{collection: "AdimAuthData"})



const UserModel = mongoose.model('AdimData',AdimSchema)

module.exports = UserModel