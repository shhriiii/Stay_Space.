const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner , validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");

const upload = multer({ storage });

//using router.route for index and create 
router.route("/")
.get( wrapAsync(listingController.index)) 
 .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));

// new should be used before id bcase route can assumenew as id if used after
 router.get("/new" , isLoggedIn, listingController.renderNewForm);
 //show route(read)
 //using router.route for show andupdte and dlt
 router.route("/:id")
 .get(wrapAsync(listingController.showListing))
 .put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));
 
 router.get("/:id" , wrapAsync(listingController.showListing));
 //create route (add button)
//  router.post("/" ,isLoggedIn,validateListing, wrapAsync(listingController.createListing)
//  );

 //edit
 router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
 //update 
 // Update Route
//yaha peedit wala ahr ek route mai use kne se aca hum middleware banaenge aur usko use krre hounge
// router.put(
//     "/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing)
//   );
 //delte route
//  router.delete("/:id" ,isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));
 
 //review route 
 //post route
 module.exports = router;
