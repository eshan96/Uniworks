const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    name: {
       type: String,
       required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        // validate: {
        //     validator: function(v) {
        //       return /\d{3}-\d{3}-\d{4}/.test(v);
        //     },
        //     message: props => `${props.value} is not a valid phone number!`
        //   },
        required : true,
        unique: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    occupation: {
        type: String,
        required: true
    },
    caption: {
        type: String,
    },
    avatar: {
        type: String
    }
},{
    timestamps: true
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });


userSchema.statics.uploadedAvatar = multer({storage:  storage}).single('avatar');
userSchema.statics.avatarPath = AVATAR_PATH

const User = mongoose.model('User', userSchema);
module.exports = User