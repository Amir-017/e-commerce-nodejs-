import express from "express";
import { auth, authorize } from "../middleWare/auth.js";
const router = express.Router()

import { createOrder,  getAllOrders } from "../controllers/order.controller.js";
import { validateOrder } from "../utils/validateOrder.js";

router.get("/", auth, authorize("admin"), getAllOrders);
router.post("/", auth,authorize("member"), validateOrder, createOrder);


export default router;