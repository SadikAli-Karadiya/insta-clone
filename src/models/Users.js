require("../database/databaseConn");
const {JWT_SECRET_KEY} = require('../config/keys');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  setPasswordToken: { 
    type:String
  },
  tokenExpiry:{
    type: Date
  },
  profilePic:{
    type: String,
    default: 'https://icons-for-free.com/iconfiles/png/512/human+person+user+icon-1320196276306824343.png'
  },
  token: {
    type: String,
  },
  followers:[
    {
      type: ObjectId,
      ref: 'user'
    }
  ],
  followings:[
    {
      type: ObjectId,
      ref: 'user'
    }
  ]
});

userSchema.pre("save", async function (req, res, next) {
    this.password = await bcrypt.hash(this.password,10);
  next();
});

userSchema.methods.createToken = async function(){
  try {
    const token = jwt.sign({_id:this._id},JWT_SECRET_KEY);
    this.token = token;
    return token;

  } catch (error) {
    res.send("can't generate token:",error)
  }
}
const User = mongoose.model("user", userSchema);

module.exports = User;
