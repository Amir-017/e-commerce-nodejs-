import express from "express";
import { auth, authorize } from "../middleWare/auth.js";
const router = express.Router()

import { createOrder, getAllOrders } from "../controllers/order.controller.js";
import { validateOrder } from "../utils/validateOrder.js";

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access only.
 *       500:
 *         description: Internal server error.
 */
router.get("/", auth, authorize("admin"), getAllOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 6890f2d7e5a123456789abcd
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               shippingAddress:
 *                 type: string
 *                 example: Cairo, Egypt
 *               paymentMethod:
 *                 type: string
 *                 example: Cash On Delivery
 *     responses:
 *       201:
 *         description: Order created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 */
router.post(
    "/",
    auth,
    authorize("member"),
    validateOrder,
    createOrder
);


export default router;