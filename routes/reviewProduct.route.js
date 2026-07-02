import express from "express";
import { auth, authorize } from "../middleWare/auth.js";
import { addReviewProduct, deleteReviewProduct, getAllReviewProducts, getReviewProductByProductId } from "../controllers/reviewProduct.controller.js";
import { validateReview } from "../utils/validationReviews.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Product Reviews
 *   description: Manage product reviews
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Get all product reviews
 *     tags: [Product Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access only.
 *       500:
 *         description: Internal server error.
 */
router.get("/", auth, authorize("admin"), getAllReviewProducts);

/**
 * @swagger
 * /reviews/{productId}:
 *   post:
 *     summary: Add a review to a product
 *     tags: [Product Reviews]
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
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent product!
 *     responses:
 *       201:
 *         description: Review added successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 */
router.post(
    "/:productId",
    auth,
    authorize("member"),
    validateReview,
    addReviewProduct
);

/**
 * @swagger
 * /reviews/{productId}:
 *   get:
 *     summary: Get all reviews for a specific product
 *     tags: [Product Reviews]
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
 *         description: Product reviews retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Product not found.
 */
router.get(
    "/:productId",
    auth,
    authorize("admin", "member"),
    getReviewProductByProductId
);

/**
 * @swagger
 * /reviews/{id}/{reviewId}:
 *   delete:
 *     summary: Delete a product review
 *     tags: [Product Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Product or review not found.
 */
router.delete(
    "/:id/:reviewId",
    auth,
    authorize("member", "admin"),
    deleteReviewProduct
);


export default router;