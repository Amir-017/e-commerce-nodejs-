import express from "express";
import { auth, authorize } from "../middleWare/auth.js";
import { addReviewProduct, deleteReviewProduct, getAllReviewProducts, getReviewProductByProductId } from "../controllers/reviewProduct.controller.js";
import { validateReview } from "../utils/validationReviews.js";

const router = express.Router();

router.get("/",auth, authorize("admin"), getAllReviewProducts);
router.post("/:productId", auth,authorize("member"), validateReview, addReviewProduct);
router.get("/:productId", auth,authorize("admin","member"), getReviewProductByProductId);
router.delete("/:id/:reviewId", auth, authorize("member","admin"), deleteReviewProduct);


export default router;