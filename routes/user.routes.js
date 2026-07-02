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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access only.
 *       500:
 *         description: Internal server error.
 */
router.get("/", auth, authorize("admin"), allUser);




 // user routes with swagger documentation
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current logged in user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
router.get("/me", auth, authorize("admin", "member"), infoUser);

// post user route with swagger documentation
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Amir
 *               email:
 *                 type: string
 *                 example: amir@example.com
 *               password:
 *                 type: string
 *                 example: Password123@
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Validation error.
 */
router.post("/", validationPostUsers, mainValidation, registerUser);


// login user route with swagger documentation
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: amir@example.com
 *               password:
 *                 type: string
 *                 example: Password123@
 *     responses:
 *       200:
 *         description: Login successful.
 *       401:
 *         description: Invalid email or password.
 */
router.post("/login", loginUser);

// refresh token route with swagger documentation
/**
 * @swagger
 * /users/refreshToken:
 *   post:
 *     summary: Generate a new access token using refresh token
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: New access token generated.
 *       401:
 *         description: Invalid refresh token.
 */
router.post("/refreshToken", refreshNewToken);


// get user profile route with swagger documentation
/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get logged in user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *       401:
 *         description: Unauthorized.
 */
router.get("/profile", auth, authorize("admin", "member"), UserById);

// update user profile route with swagger documentation
/**
 * @swagger
 * /users/editeProfile:
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 */
router.patch(
  "/editeProfile",
  auth,
  authorize("member", "admin"),
  validatePatchUser,
  mainValidation,
  updateUser
);

// change password route with swagger documentation
/**
 * @swagger
 * /users/convertPassword:
 *   patch:
 *     summary: Change current user's password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Invalid current password.
 *       401:
 *         description: Unauthorized.
 */
router.patch("/convertPassword", auth, authorize("member"), changePassword);

// delete user route with swagger documentation
/**
 * @swagger
 * /users/deleteUser/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       401:
 *         description: Unauthorized.
 */
router.delete("/deleteUser/:id", auth, authorize("member", "admin"), deleteUser);

// change user role route with swagger documentation
/**
 * @swagger
 * /users/{id}/role:
 *   patch:
 *     summary: Change user role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - member
 *     responses:
 *       200:
 *         description: User role updated successfully.
 *       400:
 *         description: Invalid role.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin only.
 */
router.patch("/:id/role", auth, authorize("admin"), changeRole);

// forgot password route with swagger documentation
/**
 * @swagger
 * /users/forgotPassword:
 *   post:
 *     summary: Send password reset email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: amir@example.com
 *     responses:
 *       200:
 *         description: Reset email sent successfully.
 *       404:
 *         description: User not found.
 */
router.post("/forgotPassword", forgotPassword);

// reset password route with swagger documentation
/**
 * @swagger
 * /users/resetPassword:
 *   post:
 *     summary: Reset user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *       400:
 *         description: Invalid or expired token.
 */
router.post("/resetPassword", resetPassword);
export default router;
    