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

router.post('/uploadProfilePic', auth, (req,res) =>{
  try {
    const imageLink = req.body.imageUrl
    User.findOneAndUpdate({_id:req.user._id}, {$set:{profilePic:imageLink}}, {useFindAndModify:false, new:true, multi:true})
    .select({password:0})
    .exec((err, result)=>{
      if(result){
        res.send(result)
      }
      else{
        res.send(error)
      }
    })
  } catch (error) {
    res.send(error)
  }
})

router.get('/allpost', auth, (req,res) =>{
  try {
    CreatePostCollection.find()
    .populate("comments.postedBy", '_id name')
    .populate('postedBy','_id name')
    .sort('-createdAt')     //sort the data in descending, remove - gives in ascending
    .then(posts =>{
      res.send(posts)
    })
    .catch(error =>{
      res.send(error)
    })
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

router.get('/myfollowingsposts', auth, (req,res) =>{
  try {
    CreatePostCollection.find({postedBy:{$in:req.user.followings}})
    .populate("comments.postedBy", '_id name')
    .populate('postedBy','_id name profilePic')
    .sort('-createdAt')
    .then(posts =>{
      User.find({_id:req.user.followings})
      .select({profilePic:1, name:1, email:1})
      .limit(6)
      .then(user=>{
        res.send({posts, user})
      })
      .catch(err=>{
        res.send(err)
      })
    })
    .catch(error =>{
      res.send(error)
    })
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

router.get('/mypost', auth, async (req,res) =>{
  try {
     currentUser = req.user._id
    CreatePostCollection.find({postedBy: currentUser})
    .select({photo:1})
    .sort('-createdAt')
    .exec((err,posts) =>{
      if(err){
        return res.send(err)
      }
      else{
        User.find({_id:currentUser}).select({password:0})
        .then((user)=>{
          res.send({posts, user})
        })
        .catch((error)=>{
          res.send(error)
        })
      }
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

router.post('/createpost', auth, async (req,res)=>{
  try {
    const title = req.body.titleBodyDetail.title;
    const body = req.body.titleBodyDetail.body;
    const imageUrl = req.body.imageUrl;

    const data = new CreatePostCollection({
      title:title,
      body:body,
      photo:imageUrl,
      postedBy:req.user
    })
    data.save();
    res.send('post created')

  } catch (error) {
    res.send(error.message);
  }
})

router.put('/like', auth, (req,res)=>{
  try {
    CreatePostCollection.findOneAndUpdate({_id:req.body.itemId},{$push:{likes:req.user._id}}, {useFindAndModify:false, new:true, multi:true})
    .populate("comments.postedBy", '_id name')
    .populate('postedBy', '_id name')
    .exec((error, result)=>{
      if(error){
        return res.status(422).send(error)
      }
      res.send(result)
    })

  } catch (error) {
    console.log(error)
    res.send(error)
  }
})
router.put('/unlike', auth, async(req,res)=>{
  try {
    CreatePostCollection.findOneAndUpdate({_id:req.body.itemId},{$pull:{likes:req.user._id}}, {useFindAndModify:false, new:true, multi:true})
    .populate("comments.postedBy", '_id name')
    .populate('postedBy', '_id name')
    .exec((error, result)=>{
      if(error){
        return res.status(422).send(error)
      }
      res.send(result)
    })

  } catch (error) {
    console.log(error)
    res.send
  }
})

router.put('/comment', auth, (req, res) =>{
  try {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id
    }
    CreatePostCollection.findOneAndUpdate({_id:req.body.itemId}, {$push:{comments:comment}}, {useFindAndModify:false, new:true, multi:true})
    .populate("comments.postedBy", '_id name')
    .populate("postedBy", '_id name')
    .exec((error, result)=>{
      if(error){
        return res.status(422).send(error)
      }
      res.send(result)
    })
    
  } catch (error) {
    console.log(error)
    res.send(error)
    
  }
})

router.post('/deletepost', auth, (req,res)=>{
  try {
    CreatePostCollection.deleteOne({_id:req.body.itemId})
    .exec(async (error, result)=>{
      if(result){
        currentUser = req.user._id
        const myPosts = await CreatePostCollection.find({postedBy: currentUser}).select({photo:1})
        res.send(myPosts)
      }
      else{
        res.send(error)
      }
    })
    
  } catch (error) {
    res.send(error)
  }
})

module.exports = router;
