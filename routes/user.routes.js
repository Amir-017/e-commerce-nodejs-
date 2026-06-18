import express from "express";
import {
  allUser,
  registerUser,
  UserById,
  updateUser,
  deleteUser,
  loginUser,
  changePassword,
  changeRole,
  infoUser,
  refreshNewToken,
  forgotPassword,
  resetPassword

} from "../controllers/user.controller.js";
import {
  validatePatchUser,
  validationPostUsers,
} from "../utils/validationUsers.js";
import { mainValidation } from "../utils/mainValidation.js";
import { auth, authorize } from "../middleWare/auth.js";
// import { upload } from '../utils/multer.js'
const router = express.Router();

router.get("/",auth,authorize('admin'), allUser);
router.get("/me",auth,authorize('admin','member'), infoUser);
router.post("/", validationPostUsers, mainValidation, registerUser);
router.post("/login", loginUser);
router.post("/refreshToken", refreshNewToken);
router.get("/profile",auth,authorize('admin','member'), UserById);
router.patch("/editeProfile",auth,authorize('member','admin'), validatePatchUser, mainValidation, updateUser);
router.patch("/convertPassword",auth,authorize('member'), changePassword);
router.delete("/deleteUser",auth,authorize('member','admin'), deleteUser);   
router.patch("/:id/role",auth,authorize('admin'), changeRole);   
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
export default router;
    