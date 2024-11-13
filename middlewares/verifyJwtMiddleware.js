const AuthModels = require("../models/authModels");
const jwt = require("jsonwebtoken");
const verifyJWTMiddleware = (req, res, next) => {
  const token =
    req.cookies.token ||
    (req.headers.authorization && req.headers.authorization.split(" ")[1]);
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!token) {
      return res.status(400).json({
        error: "No Token Provided",
        statusCode: 400,
      });
    }
  
    jwt.verify(token, secretKey, async (err, data) => {
      const userModels = AuthModels.userSchema();
      
      if (err) {
        return res.status(400).json({
          error: "Invalid Token",
          statusCode: 400,
        });
      }
      const userData = await userModels.findById(data.userId);
  
      if (!userData) {
        return res.status(400).json({
          error: "User Not Exist",
          statusCode: 403,
        });
      }
      const existToken = userData.tokens.filter((item)=>item.id === data.id);
      if (existToken.length ===0) {
        return res.status(400).json({
          error: "Session Expired",
          statusCode: 403,
        });
      }
      req.user = data;
      next();
    });
  } catch (error) {
    return res.status(500).json({
        error: "internal server",
        statusCode: 500,
      });
  }
 
};

module.exports = verifyJWTMiddleware;
