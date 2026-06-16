import mongoose from "mongoose";

const reviewProductSchema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    reviews: [
        {
            userName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            rating: {
                type: String,
                trim: true,
                required: true,
            },
            title: {
                type: String,
                trim: true,
                required: true,
            },
            review: {
                type: String,
                trim: true,
                required: true,
            },

        },
    ]
},{ timestamps: true });

const reviewProductModel = mongoose.model("reviewProduct", reviewProductSchema);

export default reviewProductModel;
