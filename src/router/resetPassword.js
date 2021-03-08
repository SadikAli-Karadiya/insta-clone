const User = require("../models/Users");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const bcrypt = require('bcryptjs');
const validator = require('validator');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {nodemailerAPI_KEY, EMAIL} = require('../config/keys')
const crypto = require('crypto')

router.use(express.json());
router.use(cors());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:nodemailerAPI_KEY
  }
}))
  
router.put('/resetpassword', async (req,res)=>{
    try {
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.send("* This Email doesn't exist")
    }
    
    crypto.randomBytes(32, (err, buffer)=>{
        if(err){
            return res.send('* Failed to generate token');
        }
        const token = buffer.toString('hex');
        User.findOneAndUpdate({_id:user._id}, {$set:{setPasswordToken:token, tokenExpiry:Date.now() + 3600000 }}, {useFindAndModify:false, new:true, multi:true})
        .exec((err, currentUser)=>{
            if(err){
                return res.send(err)
            }
            transporter.sendMail({
                to: currentUser.email,
                from:'karadiyasadikali786@gmail.com',
                subject:'Reset your password',
                html:`<h3>Click <a href='${EMAIL}/resetpassword/${token}'>here</a> to reset your password</h3>`
            }).then((res)=>{}).catch((error)=>{})

            res.send('* Check your email')
        })
    })

    } catch (error) {
    res.send(error);
    }
})

router.post('/newpassword', async (req,res)=>{
    try {
        const newPassword = req.body.userPassword
        const token = req.body.token
        
        if(!newPassword){
            return res.send("* Field Required");
        }
        if (!validator.isLength(newPassword, { min: 5 })) {
            return res.send("* Password should contain atleast 5 character");
          }

        User.findOne({setPasswordToken: token})
        .then((user) => {
            
            if(!user || Date.now() > user.tokenExpiry){
                return res.send('* Token Expired, try again')
            }

            bcrypt.hash(newPassword, 10)
            .then(hashedPassword =>{
                User.findOneAndUpdate({_id:user._id}, {$set:{password:hashedPassword, setPasswordToken:undefined , tokenExpiry:undefined }}, {useFindAndModify:false, new:true, multi:true})
                .exec((err, currentUser)=>{
                    if(err){
                        return res.send(err)
                    }
                    transporter.sendMail({
                        to: currentUser.email,
                        from:'karadiyasadikali786@gmail.com',
                        subject:'Password Updated',
                        html:'<h3>Your <b>password</b> has been updated</h3>'
                    }).then((res)=>{}).catch((error)=>{})

                    res.send('New password saved successfull')
                })
            })
            .catch(err =>{
                res.send(err)
            })
        }).catch((err) => {
            res.send(err)
        });
    
    } catch (error) {
        res.send(error)
    }
})

module.exports = router