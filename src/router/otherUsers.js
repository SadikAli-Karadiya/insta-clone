const User = require("../models/Users");
const express = require("express");
const router = express.Router();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const CreatePostCollection = require('../models/CreatePostCollection');
const auth = require('../middleware/auth');

router.use(express.json());
router.use(cors());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());

router.get('/profile/:userId', auth, (req,res)=>{
    try {
        User.find({_id:req.params.userId})
        .select({password:0}) // second method: select("-password")
        .then( user=>{
            CreatePostCollection.find({postedBy:req.params.userId})
            .populate('postedBy', '_id name')
            .exec((err,posts)=>{
                if(posts){
                    res.send({user,posts})
                }
                else{
                    console.log(err)
                }
            })
        })
        .catch((error)=>{
            res.send(error)
        })
    } catch (error) {
        res.send(error)
    }
})

router.put('/follow', auth, (req,res)=>{
    try {
        User.findOneAndUpdate({_id:req.body.followId}, {$push:{followers:req.user._id}}, {useFindAndModify:false, new:true, multi:true})
        .select({password:0})
        .exec((err, otherUser) =>{
            if(err){
                res.send(err)
            }
            else{
                User.findOneAndUpdate({_id:req.user._id}, {$push:{followings:req.body.followId}}, {useFindAndModify:false, new:true, multi:true})
                .select({password:0})
                .then((currentUser)=>{
                  res.send(otherUser)  
                })
                .catch((error)=>{
                    res.send(error)
                })
            }
        })
    } catch (error) {
        res.send(error)
    }
})

router.put('/unfollow', auth, (req,res)=>{
    try {
        User.findOneAndUpdate({_id:req.body.unfollowId}, {$pull:{followers:req.user._id}}, {useFindAndModify:false, new:true, multi:true})
        .select({password:0})
        .exec((err, result) =>{
            if(err){
                res.send(err)
            }
            else{
                User.findOneAndUpdate({_id:req.user._id}, {$pull:{followings:req.body.unfollowId}}, {useFindAndModify:false, new:true, multi:true})
                .select({password:0})
                .then((data)=>{
                  res.send(data)  
                })
                .catch((error)=>{
                    res.send(error)
                })
            }
        })
    } catch (error) {
        res.send(error)
    }
})

router.post('/search-user', auth,(req,res)=>{
    try {   
        const searchedPattern = new RegExp('^'+req.body.searchQuery)
        if(searchedPattern=='/^/'){   //if user delete all the letters then return null
            return 
        }
        User.find({email:{$regex:searchedPattern}})
        .select('_id email')
        .then(users=>{
            if(users == ''){
                return res.send('User not found')
            }
            res.send(users)
        })
        .catch(err=>{
            res.send(err)
        })
    } catch (error) {
        res.send(error)
    }
})

module.exports = router