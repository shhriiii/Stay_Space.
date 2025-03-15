const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema , reviewSchema } = require("../schema.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");



const validateReview = (req , res , next) =>{
    let { error } = reviewSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 ,errMsg);
    }
    else{
        next();
    }

}
router.post("/" ,validateReview , wrapAsync(async(req , res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success" , "Review added successfully");
    res.redirect(`/listings/${listing._id}`);

}));

//delete review
// Delete Review Route
// router.delete("/listings/:id/reviews/:reviewId
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
   //find by id and update is bcz we want to delete the listing from the array also
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    //this will dlete from page only
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review deleted successfully");

    res.redirect(`/listings/${id}`);
}));

module.exports = router;