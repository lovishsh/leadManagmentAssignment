const AuthModels = require("../models/authModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto=require('crypto');
class AuthController {
  static async register(req, res) {
    const { name, email, password, role } = req.body;

    try {
      if (!name || !email || !password || !role) {
        return res.status(400).json({
          error: "Missing Required Fields",
          statusCode: 400,
        });
      }
      const userSchemaModel = AuthModels.userSchema();
      const checkUser = await userSchemaModel.findOne({ email });
      if (checkUser) {
        return res.status(400).json({
          error: "User Already Created",
          statusCode: 400,
        });
      }
      const hashPassword = await bcrypt.hash(password, 12);
      const newData = userSchemaModel({
        name,
        email,
        password: hashPassword,
        role,
        tokens,
      });
      await newData.save();
      return res.status(200).json({
        message: "user created successfully",
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "internal server",
        statusCode: 500,
      });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const userModel = AuthModels.userSchema();
      const checkUser = await userModel.findOne({ email });
      const secretKey = process.env.JWT_SECRET_KEY;
      if (!checkUser) {
        return res.status(400).json({
          error: "Account doesn't exist",
          statusCode: 400,
        });
      }
      const checkPassword = await bcrypt.compare(password, checkUser.password);
      if (!checkPassword) {
        return res.status(400).json({
          error: "Invalid Credentials",
          statusCode: 400,
        });
      }
      const id=crypto.randomBytes(8).toString('hex');
      const generateToken = jwt.sign({ userId: checkUser._id,id}, secretKey, {
        expiresIn: "1d",
      });
      checkUser.tokens.push({
        id,
        tokens:generateToken
      });

      await userModel.updateOne(
        { email },
        { $set: { tokens: checkUser.tokens } }
      );
      res.cookie("token", generateToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: "None",
        path: "/",
      });
      return res.status(200).json({
        message: "login successfully",
        statusCode: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "internal server",
        statusCode: 500,
      });
    }
  }
  static async logout(req, res) {
      try {
        const {id,userId}=req.user;
        console.log(id);
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development" ? false : true,
        sameSite: "None",
        path: "/",
      });
      const userModel=AuthModels.userSchema();
      const userData=await userModel.findById(userId);
      const filterToken=userData.tokens.filter((item)=>item.id !== id);
      await userModel.updateOne({_id:userId},{$set:{tokens:filterToken}})
      return res.status(200).json({
        error: "Logout Successfull",
        statusCode: 200,
      });
    } catch (error) {
      return res.status(500).json({
        error: "internal server",
        statusCode: 500,
      });
    }
  }
}
module.exports = AuthController;
