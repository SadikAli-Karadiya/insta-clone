const mongoUrl = process.env.MONGOURL
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const nodemailerAPI_KEY= process.env.nodemailerAPI_KEY
const EMAIL = process.env.EMAIL

module.exports = {mongoUrl, JWT_SECRET_KEY, nodemailerAPI_KEY, EMAIL};