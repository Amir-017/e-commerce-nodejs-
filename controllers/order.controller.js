import { cartModel } from "../models/cart.model.js";
import { orderModel } from "../models/order.model.js";


/////////////////////////////////////

 // create order for user only

///////////////////////////////////// 
export const createOrder = async (req, res) => {
   const data = req.body
   const findCart = await cartModel.findOne({ userName: req.userId }).lean()
   const order = await orderModel.create({
      userName: req.userId,
      products: findCart.products,
      userInfo: data
   })

   res.json(order)
};

//////////////////////////////

// get all orders for admin only

/////////////////////////////
export const getAllOrders = async (req, res) => {
   const allOrders = await orderModel.find().populate("products.product")
   return res.status(200).json(allOrders);
};