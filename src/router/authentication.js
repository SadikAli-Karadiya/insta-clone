const User = require("../models/Users");
const express = require("express");
const cors = require("cors");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {nodemailerAPI_KEY} = require('../config/keys');

router.use(express.json());
router.use(cors());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());

const router = express.Router();
const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:nodemailerAPI_KEY
  }
}))

router.post("/signup", async (req, res) => {
    try {
      const userData = new User(req.body)
      if (userData.name == "" || userData.email == "" || userData.password == "") {
        return res.send("* All Fields Required");
      } 
      else {
        if (!validator.isAlpha(userData.name)) {
          return res.send("* Name contains only letters");
        }
        if (!validator.isLength(userData.name, {min: 3})) {
          return res.send("* Name should contain atleast 3 character");
        }
        if (!validator.isEmail(userData.email)) {
          return res.send("* Invalid Email");
        }
        if (!validator.isLength(userData.password, { min: 5 })) {
          return res.send("* Password should contain atleast 5 character");
        }
        if (await User.findOne({ name: userData.name })) {
          return res.send("* This name is not available");
        }
        if (await User.findOne({ email: userData.email })) {
          return res.send("* Email already exist");
        }
  
        await userData.save()
        .then((user)=>{
          transporter.sendMail({
            to:user.email,
            from:'karadiyasadikali786@gmail.com',
            subject:"Successfully Signup",
            html:"<h1>Welcome to Instagram</h1>"
          }).then((res)=>{}).catch((error)=>{})
  
          res.send("SignUp successfully");
        })
        .catch((error)=>{
          res.send(error)
        })
      }
    } catch (error) {
      res.send(error);
    }
  });
  
  router.post('/signin', async (req,res)=>{
      try {
          const userEmail = req.body.email;
          const userPassword = req.body.password;
          
          if(!userEmail || !userPassword){
            return res.send('* All fields required');
          }
          
          const user = await User.findOne({email:userEmail})
          if(!user){
            return res.send('* Invalid email or password');
          }
          else{
            const isMatch = await bcrypt.compare(userPassword, user.password)
            if(isMatch){
              const token = await user.createToken();
              await User.findOneAndUpdate({_id:user._id},{$set:{token:token}},{useFindAndModify:false, new:true, multi:true});
              res.send(user)
            }
            else{
              return res.send('* Invalid email or password')
            }
          }
      } catch (error) {
        res.send(error);
      }
  })

module.exports = router