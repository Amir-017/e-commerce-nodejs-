import mongoose from "mongoose";
import { userModel } from "../models/user.model.js";
import { errorHandling } from "../utils/errorHandling.js";
import { httpError } from "../utils/httpError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import nodemailer from "nodemailer";
//////////////////////////////////////////////

// get users

//////////////////////////////////////////////
export const allUser = errorHandling(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const users = await userModel.find({}).skip(skip).limit(Number(limit));
  if (!users.length) return next(new httpError(404, "users not found"));

  const total = await userModel.countDocuments({});
  console.log(users);

  res.json({
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    status: 200,
    message: "users fetched successfully",
    data: users,
  });
});

//////////////////////////////////////////////

// post user

//////////////////////////////////////////////
export const registerUser = errorHandling(async (req, res, next) => {
  const main = req.body;
  const postedOne = await userModel.create(main);
  if (!postedOne) return next(new httpError(404, "User not found"));
  res.json({
    status: 200,
    message: "user posted successfully",
    data: postedOne,
  });
});

//////////////////////////////////////////////

// get user by Id

//////////////////////////////////////////////

export const UserById = errorHandling(async (req, res, next) => {
  const id = req.userId;
  // console.log(req.userId);

  const foundOne = await userModel.findById(id);
  if (!foundOne) return next(new httpError(400, "User not found"));
  res.json({
    status: 200,
    message: "user found successfully",
    data: foundOne,
  });
});

//////////////////////////////////////////////

// update user (name , email)

//////////////////////////////////////////////
export const updateUser = errorHandling(async (req, res, next) => {
  const id = req.userId;
  const main = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return next(new httpError(400, "invalid user Id"));

  const updatedOne = await userModel.findByIdAndUpdate(id, main, { new: true });
  if (!updatedOne) return next(new httpError(404, "User not found"));
  res.json({
    status: 200,
    message: "User updated successfully",
    data: updatedOne,
  });
});

//////////////////////////////////////////////

// update user password

//////////////////////////////////////////////

export const changePassword = errorHandling(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await userModel.findById(req.userId);

  if (!user) {
    return next(new httpError(404, "User not found"));
  }

  // check current password

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    // return res.status(400).json("");
    return next(new httpError(400, "Current password is wrong"));
  }

  // hash new password

  // const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = newPassword;
  // hashedPassword;

  await user.save();

  res.status(200).json({
    message: "Password updated successfully",
  });
});

//////////////////////////////////////////////

// delete user

//////////////////////////////////////////////
export const deleteUser = errorHandling(async (req, res, next) => {
  const id = req.userId;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new httpError(400, "invalid user Id"));
  }

  const user = await userModel.findById(id);
  if (!user) return next(new httpError(404, "User not found"));

 // configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.NODE_MILER_KEY,
  },
});
 // send email to user before deleting account
try {
  const info = await transporter.sendMail({
    from: `Market <${process.env.EMAIL_USER}>`, 
    to: `${user.email}`,
    subject: `Hello dear user ${user.name}`,
    text: "i'd love to tell u your account has been deleted",
    html: "<b>if you have any questions, please contact support.</b>",
  });
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} catch (err) {
  console.error("Error while sending mail:", err);
}
  
  // 2. then delete user
  const deletedUser = await userModel.findByIdAndDelete(id);

  if (!deletedUser) {
    return next(new httpError(404, "User not found"));
  }

  res.json({
    status: 200,
    message: "user deleted successfully",
    data: deletedUser,
  });
});

//////////////////////////////////////////////

// Change role of  user

//////////////////////////////////////////////
export const changeRole = errorHandling(async (req, res, next) => {
  const { role } = req.body;
  const { id } = req.params;
  const RoleOfUser = await userModel.findByIdAndUpdate(
    id,
    { role },
    { new: true },
  );
  if (!RoleOfUser) return next(new httpError(400, "Can't change role of User"));
  res.json({
    status: 200,
    message: "User role changed successfully",
    RoleOfUser,
  });
});

export const infoUser = errorHandling(async (req, res, next) => {
  const infoAboutUser = await userModel
    .findById(req.userId)
    .select("-password");
  res.json({
    status: 200,
    message: "User info  successfully",
    infoAboutUser,
  });
});

//////////////////////////////////////////////

// login user

//////////////////////////////////////////////
export const loginUser = errorHandling(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new httpError(400, "please entire Email & Password"));
  // console.log(email + " " + password);

  const user = await userModel.findOne({ email });
  if (!user) return next(new httpError(404, "Sorry you don't have an account, please register first"));

  const hashPassword = await bcrypt.compare(password, user.password);

  if (!hashPassword) return next(new httpError(400, "Invalid password"));

  const accesstoken = jwt.sign(
    { id: user._id, email, role: user.role },
    process.env.LOGIN_KEY,
    { expiresIn: "7d" },
  );
  const refreshToken = jwt.sign(
    { id: user._id, email, role: user.role },
    process.env.LOGIN_KEY,
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });

  if (!accesstoken) return next(new httpError(404, "something went wrong"));
  // console.log(accesstoken);
  // console.log(user);

  res.json({
    accesstoken,
    name: user.name,
  });
});

//////////////////////////////////////////////

// refresh token to make user active all time until he logout

//////////////////////////////////////////////
export const refreshNewToken = errorHandling(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  console.log(req.cookies);

  if (!refreshToken) return next(new httpError(401, "You must login first"));
  try {
    const decoded = jwt.verify(refreshToken, process.env.LOGIN_KEY);
    req.userId = decoded.id;
    req.role = decoded.role;
    console.log(decoded);

    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, role: decoded.role },
      process.env.LOGIN_KEY,
      { expiresIn: "7d" },
    );
    res.json({ accesstoken: newToken });
  } catch (error) {
    next(new httpError(403, "token expired"));
  }
});
