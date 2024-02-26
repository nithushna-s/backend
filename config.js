
require('dotenv').config();

module.exports = {
  secretKey: process.env.SECRET_KEY,
  mongoURI: process.env.DATABASE_URL,
};
