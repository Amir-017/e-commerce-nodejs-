import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: { 
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },   
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    userInfo:{
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
    },
    governorate: {
        type: String,
        required: true,
  },
  orderNote: {
    type: String,
  },
},
  }, { timestamps: true },
);


export const orderModel = mongoose.model("Order", orderSchema);
   