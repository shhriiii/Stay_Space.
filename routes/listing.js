const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();

const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner , validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
//index route
router.get("/" , wrapAsync(listingController.index));
 //new route 
 //how route ke upar page 10
 router.get("/new" , isLoggedIn, listingController.renderNewForm);
 //show route(read)
 router.get("/:id" , wrapAsync(listingController.showListing));
 //create route (add button)
 router.post("/" ,isLoggedIn,validateListing, wrapAsync(listingController.createListing)
 );

 //edit
 router.get("/:id/edit" ,isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));
 //update 
 // Update Route
//yaha peedit wala ahr ek route mai use kne se aca hum middleware banaenge aur usko use krre hounge
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
  );
 //delte route
 router.delete("/:id" ,isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));
 
 //review route 
 //post route
 module.exports = router;
