import { body } from "express-validator";

export const validateReview = [
    body("comment").isString().withMessage("comment must be string").notEmpty().withMessage("comment is required"),
    body("rating").isString().withMessage("rating must be string").notEmpty().withMessage("rating is required"),
    body("notes").isString().withMessage("notes must be string").notEmpty().withMessage("notes is required")
];