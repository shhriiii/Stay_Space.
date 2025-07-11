const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const { listingSchema , reviewSchema } = require("../schema.js");
// const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isreviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");




router.post("/" ,isLoggedIn,validateReview , wrapAsync(reviewController.createReview));

//delete review
// Delete Review Route
// router.delete("/listings/:id/reviews/:reviewId
router.delete("/:reviewId",isLoggedIn,isreviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;