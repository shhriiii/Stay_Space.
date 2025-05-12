const Listing = require('../models/listing.js');
const Review = require('../models/review.js');



module.exports.createReview = async(req , res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success" , "Review added successfully");
    res.redirect(`/listings/${listing._id}`);

};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
   //find by id and update is bcz we want to delete the listing from the array also
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    //this will dlete from page only
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review deleted successfully");

    res.redirect(`/listings/${id}`);
}