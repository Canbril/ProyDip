require('dotenv').config();

module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpireTime: process.env.JWT_EXPIRE_TIME
};
