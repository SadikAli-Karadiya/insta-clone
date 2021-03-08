const express = require('express');
const PORT = process.env.PORT || 8000;
const app = express();
const posts = require('./src/router/posts');
const authentication = require('./src/router/authentication');
const otherUsers = require('./src/router/otherUsers')
const resetPassword  = require('./src/router/resetPassword')

app.use(authentication)
app.use(posts)
app.use(otherUsers)
app.use(resetPassword)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('frontend/build'))
    const path = require('path')
    app.get('*', (req,res)=>{
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
}
app.listen(PORT,()=>{
    console.log(`Listening to the port ${PORT}`);
})