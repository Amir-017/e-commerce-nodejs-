import express from "express";
import {
  getCart,
  getCartById,
  postCart,
  updateCart,
  deleteSpecificProduct,
  clearCart,
} from "../controllers/cart.controller.js";
import { auth, authorize } from "../middleWare/auth.js";
const router = express.Router();

router.use(auth);
/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Cart not found.
 */
router.get("/", authorize("member"), getCart);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear the current user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Cart not found.
 */
router.delete("/", authorize("member"), clearCart);

/**
 * @swagger
 * /cart/addTocart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 6890abc123def45678901234
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to cart successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 */
router.post("/addTocart", authorize("member"), postCart);

/**
 * @swagger
 * /cart/allCart:
 *   get:
 *     summary: Get all users' carts
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All carts retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access only.
 */
router.get("/allCart", authorize("admin"), getCartById);

/**
 * @swagger
 * /cart/{productId}:
 *   patch:
 *     summary: Update product quantity in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found in cart.
 */
router.patch("/:productId", authorize("member"), updateCart);

/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Remove a specific product from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from cart successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found in cart.
 */
router.delete("/:productId", authorize("member"), deleteSpecificProduct);

export default router;
