const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js"); // also required
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
 
 };

 module.exports.renderNewForm = (req , res) => {
     // if(!req.isAuthenticated()){
     //     req.flash("error" , "You must be signed in first");
     //     return res.redirect("/login");
     // }
     // ye sb code jyega middleware.js mai
      res.render("listings/new.ejs");
  };

  module.exports.showListing = async(req, res) =>{
       let {id} = req.params; 
       // const listing=await Listing.findById(id);
       const listing=await Listing.findById(id).populate({path: "reviews",populate:{path: "author",},}).populate("owner");
       if(!listing){
          req.flash("error" , "listing does not exist");
          res.redirect("/listings");
       }
       res.render("listings/show.ejs" , { listing });
   };

   module.exports.createListing = async(req , res , next) => {
   let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 2
      })
        .send()
        
    //one way to extrct also rembr post ke sath body use hota aur get ke sath params
    //let {title , description , image , price , country , location} = req.body;
    //other way is go to neww.ejs aur title ko listing[title] krdo mtlb key value pair bana dema
    //js object bnjata hai
    //let listing = req.body.listing;
    // if(!req.body.listing){
    //     throw new ExpressError(400 , "Invalid listing");
    // }
    let result = listingSchema.validate(req.body);
    // console.log(result);
    if(result.error){
        throw new ExpressError(400 , result.error);
    }
    let url = req.file.path;
    let filename = req.file.filename;
    
    const newListing = new Listing(req.body.listing);
    //while adding the new lsiting user is not added so we need to add it
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
        await newListing.save();
        req.flash("success" , "New listing added successfully");
       res.redirect("/listings");
    
};
module.exports.renderEditForm = async(req , res) =>{
    let { id } = req.params; 
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error" , "listing does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload" , "/upload/h_300,w_250")

    res.render("listings/edit.ejs" , { listing , originalImageUrl });  
};
    //update listing
  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing = async(req , res ) => {
    let { id } = req.params;
    let deletedListing =await Listing.findByIdAndDelete(id)
    req.flash("success" , "Listing deleted successfully");
    res.redirect("/listings")

};

