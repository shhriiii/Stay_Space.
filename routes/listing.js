const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const { listingSchema , reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

const validateListing = (req , res , next) =>{
    let { error } = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400 ,errMsg);
    }
    else{
        next();
    }

}

//index route
router.get("/" , wrapAsync(async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
 
 }));
 
 //new route 
 //how route ke upar page 10
 router.get("/new" , isLoggedIn,(req , res) => {
    // if(!req.isAuthenticated()){
    //     req.flash("error" , "You must be signed in first");
    //     return res.redirect("/login");
    // }
    // ye sb code jyega middleware.js mai
     res.render("listings/new.ejs");
 });
 
 
 //show route(read)
 router.get("/:id" , wrapAsync(async(req, res) =>{
     let {id} = req.params; 
     // const listing=await Listing.findById(id);
     const listing=await Listing.findById(id).populate("reviews").populate("owner");
     if(!listing){
        req.flash("error" , "listing does not exist");
        res.redirect("/listings");
     }
     res.render("listings/show.ejs" , { listing });
 }));
 
 //create route (add button)
 router.post("/" ,isLoggedIn,validateListing, wrapAsync(async(req , res , next) => {
     //one way to extrct also rembr post ke sath body use hota aur get ke sath params
     //let {title , description , image , price , country , location} = req.body;
     //other way is go to neww.ejs aur title ko listing[title] krdo mtlb key value pair bana dema
     //js object bnjata hai
     //let listing = req.body.listing;
     // if(!req.body.listing){
     //     throw new ExpressError(400 , "Invalid listing");
     // }
     let result = listingSchema.validate(req.body);
     console.log(result);
     if(result.error){
         throw new ExpressError(400 , result.error);
     }
     const newListing = new Listing(req.body.listing);
     //while adding the new lsiting user is not added so we need to add it
     newListing.owner = req.user._id;
         await newListing.save();
         req.flash("success" , "New listing added successfully");
        res.redirect("/listings");
     
 })
 );
 
 //edit
 router.get("/:id/edit" ,isLoggedIn, wrapAsync(async(req , res) =>{
     let { id } = req.params; 
     const listing=await Listing.findById(id);
     res.render("listings/edit.ejs" , { listing });  
 }));
 
 //update 
 router.put("/:id",isLoggedIn, validateListing, wrapAsync(async(req , res) => {
     // the error part is added to validatelisting func hence cmmented out from here
 
     // if(!req.body.listing){
     //     throw new ExpressError(400 , "Invalid listing");
     // }
     let { id } = req.params;
     await Listing.findByIdAndUpdate(id , { ...req.body.listing });
    // res.redirect("/listings"); or
    res.redirect(`/listings/${id}`);
 
 }));
 
 //delte route
 router.delete("/:id" ,isLoggedIn, wrapAsync(async(req , res ) => {
     let { id } = req.params;
     let deletedListing =await Listing.findByIdAndDelete(id)
     req.flash("success" , "Listing deleted successfully");
     res.redirect("/listings")
 
 }));
 
 //review route 
 //post route
 module.exports = router;
