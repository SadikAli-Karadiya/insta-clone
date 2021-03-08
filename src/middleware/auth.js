const jwt = require('jsonwebtoken');
const {JWT_SECRET_KEY} = require('../config/keys');
const User = require('../models/Users')

const auth = async (req,res,next) =>{

        try {
            const token = req.headers.authorization.replace('Bearer ','')
            if(!token){
                return res.send('* Login First')
            }

            const verifiedUser = jwt.verify(token, JWT_SECRET_KEY);
            const user = await User.findOne({_id:verifiedUser._id})

            req.user = user;
            req.token = token;

            next();
        } catch (error) {
            res.send(error)
        }
}

module.exports = auth