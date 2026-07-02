import express from "express";
import {
  allProduct,
  ProductById,
  postProduct,
  updateProduct,
  deleteProduct,
  allProductByCategory,
  allProductForSideBar
} from "../controllers/prodcut.controller.js";
import {
  createProductValidation,
  updateProductValidation,
} from "../utils/validationProduct.js";
import { mainValidation } from "../utils/mainValidation.js";
import { auth, authorize } from "../middleWare/auth.js";
// auth,
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/", allProduct);

/**
 * @swagger
 * /products/allCategoriesName:
 *   get:
 *     summary: Get all product category names
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Category names retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
router.get("/allCategoriesName", allProductForSideBar);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: iPhone 16 Pro
 *               description:
 *                 type: string
 *                 example: Apple flagship smartphone.
 *               price:
 *                 type: number
 *                 example: 1200
 *               stock:
 *                 type: integer
 *                 example: 25
 *               category:
 *                 type: string
 *                 example: Electronics
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access only.
 */
router.post(
  "/",
  auth,
  authorize("admin"),
  createProductValidation,
  mainValidation,
  postProduct
);

/**
 * @swagger
 * /products/category/{categoryName}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: categoryName
 *         required: true
 *         schema:
 *           type: string
 *         description: Product category name
 *     responses:
 *       200:
 *         description: Products retrieved successfully.
 *       404:
 *         description: Category not found.
 */
router.get("/category/:categoryName", allProductByCategory);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product retrieved successfully.
 *       404:
 *         description: Product not found.
 */
router.get("/:id", ProductById);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access only.
 *       404:
 *         description: Product not found.
 */
router.patch(
  "/:id",
  auth,
  authorize("admin"),
  updateProductValidation,
  mainValidation,
  updateProduct
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Admin access only.
 *       404:
 *         description: Product not found.
 */
router.delete("/:id", auth, authorize("admin"), deleteProduct);

export default router;
      