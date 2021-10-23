require('dotenv').config()

const PORT = process.env.PORT
const DB_USER = process.env.DB_USER
const DB_PASS = process.env.DB_PASS
const MONGODB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.smkmm.mongodb.net/bloglist-db?retryWrites=true&w=majority`

module.exports = {
  MONGODB_URI,
  PORT
}