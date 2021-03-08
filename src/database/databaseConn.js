const mongoose = require('mongoose');
const {mongoUrl} = require('../config/keys');

mongoose.connect(mongoUrl,{useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true})
.then(()=>{
    console.log('Connected to database')
})
.catch((error)=>{
    console.log("Can't connect to database ",error)
})