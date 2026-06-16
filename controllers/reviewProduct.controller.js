import mongoose from "mongoose";
import reviewProductModel from "../models/reviewProduct.model.js";
import { httpError } from "../utils/httpError.js";
import { errorHandling } from "../utils/errorHandling.js";
////////////////////////////////////////

// add review product

////////////////////////////////////////
export const addReviewProduct = errorHandling(
    async (req, res, next) => {
        const data = req.body;
        const { productId } = req.params;
        const reviewIsFoundOrNot = await reviewProductModel.findOne({ product: productId });

        if (!reviewIsFoundOrNot) {
            const reviewProduct = await reviewProductModel.create({
                product: productId,
                reviews: [{ ...data, userName: req.userId }]
            })
            return res.json({ message: ' product review addedd successfully', allReview: reviewProduct })
        }

        reviewIsFoundOrNot.reviews.push({ ...data, userName: req.userId });
        await reviewIsFoundOrNot.save();
        res.json({ message: "Product review added successfully", allReviews: reviewIsFoundOrNot });
        // res.json({message: "review product alredy exitst there's no choice to doing it"});
    });

/////////////////////////////////////////

// get all review products for admin 

/////////////////////////////////////////

export const getAllReviewProducts = errorHandling(async (req, res, next) => {
    const allReviews = await reviewProductModel.find().populate("reviews.userName", "-password").populate("product");
    if (!allReviews) return res.json("there's no review products")
    res.json({ message: "get all review products", allReviews });
})


/////////////////////////////////////////

// get review product by product id

/////////////////////////////////////////

export const getReviewProductByProductId = errorHandling(async (req, res, next) => {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) return next(new httpError(404, "Invalid product ID"))
    const reviewSpecificProduct = await reviewProductModel.findOne({ product: productId }).populate("reviews.userName", "-password").populate("product");
    if (!reviewSpecificProduct) return res.json("product review not found")
    res.json({ message: "get review product by product id", reviewSpecificProduct });
})


/////////////////////////////////////////

// delete review product by id

/////////////////////////////////////////
export const deleteReviewProduct = errorHandling(async (req, res, next) => {
    const { id, reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(reviewId)) return next(new httpError(404, "Invalid ID or review ID"))
    const deleteReviewUser = await reviewProductModel.findOneAndUpdate({ product: id }, {
        $pull: { reviews: { _id: reviewId } }
    })
    res.json(deleteReviewUser)
})
