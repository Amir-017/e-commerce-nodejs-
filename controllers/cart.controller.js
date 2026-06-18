import mongoose from "mongoose";
import { cartModel } from "../models/cart.model.js";
import { errorHandling } from "../utils/errorHandling.js";
import { httpError } from "../utils/httpError.js";

//////////////////////////////////////////////

// get logged-in user cart

//////////////////////////////////////////////
export const getCart = errorHandling(async (req, res, next) => {

  const cart = await cartModel
    .findOne({ userName: req.userId })
    .populate("userName")
    .populate("products.product");   
   
  if (!cart) return next(new httpError(200, data = null, "Your cart is empty go shopping"));
// console.log(cart);
const totalItems = cart.products.reduce((sum , item)=> sum + item.quantity,0)


const cartItems = cart.products.map(item => ({
  ...item.toObject(),
  totalPrice: item?.product?.price * item.quantity,
  
}));

  res.json({
    status: 200,
    message: "cart fetched successfully",
    data: cartItems, 
    totalItems
  });
});

//////////////////////////////////////////////

// add product to cart (create cart if not exist)

//////////////////////////////////////////////
export const postCart = errorHandling(async (req, res, next) => {
  const  productId  = req.body.products[0].product;
  // const  productId  = req.body.products.product[0];
  console.log(req.body.products[0].product);
   console.time("updateCart");
  const { quantity } = req.body.products[0];
  // const { quantity } = req.body.products;
  if (!productId) return next(new httpError(400, "Invalid product id"));

  // make sure we search by the same field used in the schema
  let cart = await cartModel.findOne({ userName: req.userId });
  if (!cart) {
    // when creating the document, include userName (required)
    let newCart = await cartModel.create({ userName: req.userId, products: [] });
    // push the new product to the freshly created cart below
    cart = newCart;
  }

  const checkProduct = cart.products.find(
    (item) => item.product.toString() === productId,
  );

  if (!checkProduct) {
    cart.products.push({ product: productId, quantity });
  } else {
    // console.log(quantity);
    // console.log(checkProduct.quantity);

    checkProduct.quantity += +quantity;
  }

  await cart.save();
  console.timeEnd("updateCart");
  res.json(cart);
});

//////////////////////////////////////////////

// get all cart  (for admin or debugging)
      
//////////////////////////////////////////////
export const getCartById = errorHandling(async (req, res, next) => {
  // const { id } = req.params;
  // if(mongoose.Types.ObjectId.isValid(id)) return next(new httpError(400,"Invalid id"))
  const allCart = await cartModel.find({}).populate('userName').populate('products.product');
 console.log(allCart);
 
  if (!allCart)
    return next(new httpError(404, "Your cart is empty go shopping"));
  res.json({   
    status: 200,
    message: "cart found successfully",
    data: allCart,
  });
});

//////////////////////////////////////////////

// replace cart products for logged-in user (update only quantity for product related to user)

//////////////////////////////////////////////
export const updateCart = errorHandling(async (req, res, next) => {
  const { quantity } = req.body;
  const { productId } = req.params;
console.log(quantity , productId);

  const cart = await cartModel.findOne({ userName: req.userId });

  if (!cart.products.length)
    return next(
      new httpError(404, "You have not product yet please go shopping"),
    );
    
  const checkProductHere = cart.products.find(
    (item) => item.product.toString() == productId,
  );
  // console.log(checkProductHere);
  if (quantity < 1) return next(new httpError(400, "Minimum quantity is 1"));
  checkProductHere.quantity = quantity;
  await cart.save();
  res.json(cart);
});

//////////////////////////////////////////////

// delete  specific product from cart  (delete one product)

//////////////////////////////////////////////
export const deleteSpecificProduct = errorHandling(async (req, res, next) => {
  const { productId } = req.params;

  const deleteOne = await cartModel.updateOne(
    { userName: req.userId },
    { $pull: { products: { product: productId } } },
    { new: true },
  );

  res.json({
    status: 200,
    message: "product deleted successfully",
    data: deleteOne
  });
});

//////////////////////////////////////////////

// delete  all product from cart  (clear cart)

//////////////////////////////////////////////

export const clearCart = errorHandling(async (req, res, next) => {
  const deleteAll = await cartModel.updateOne(
    { userName: req.userId },
    { $set: { products: [] } },
  );
  res.json({
    status: 200,
    message: "All products deleted successfully",
    data: deleteAll,
  });
});
