import { body } from "express-validator";


export const validateOrder = [
    body("products").isArray({ min: 1 }).withMessage("Products must be an array with at least one product"),
    body("products.*.productId").notEmpty().withMessage("Product ID is required"),
    body("products.*.quantity").isNumeric().withMessage("Quantity must be a number"),
    body("userInfo.name").notEmpty().withMessage("Name is required"),
    body("userInfo.phone").notEmpty().withMessage("Phone number is required"),
    body("userInfo.address").notEmpty().withMessage("Address is required"),
    body("userInfo.city").notEmpty().withMessage("City is required"),
    body("userInfo.governorate").notEmpty().withMessage("Governorate is required"),
];