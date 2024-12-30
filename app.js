const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
//for put req
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");



const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust"
main()
.then(()=>{
    console.log("cnntn succesfull");
})
.catch((err) => console.log(err));
async function main() {
    await mongoose.connect(MONGO_URL);

  }
  app.set("view engine" , "ejs");
  app.set("views" , path.join(__dirname, "views"));
  //for show route
  app.use(express.urlencoded({extended:true}));
  //for put req
  app.use(methodOverride("_method"));
  //for rjs mate 
  app.engine('ejs', ejsMate);
  //for css
  app.use(express.static(path.join(__dirname, "/public")));
//creating api
app.get("/" , (req , res) => {
    res.send("hi i am root!");
});

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

//for server side validation of review
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

//index route
app.get("/listings" , wrapAsync(async(req,res) =>{
   const allListings = await Listing.find({});
   res.render("listings/index.ejs" , {allListings});

}));

//new route 
//how route ke upar page 10
app.get("/listings/new" , (req , res) => {
    res.render("listings/new.ejs");
});


//show route(read)
app.get("/listings/:id" , wrapAsync(async(req, res) =>{
    let {id} = req.params; 
    // const listing=await Listing.findById(id);
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs" , { listing });
}));

//create route (add button)
app.post("/listings" ,validateListing, wrapAsync(async(req , res , next) => {
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
        await newListing.save();
       res.redirect("/listings");
    
})
);

//edit
app.get("/listings/:id/edit" , wrapAsync(async(req , res) =>{
    let { id } = req.params; 
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs" , { listing });  
}));

//update 
app.put("/listings/:id" ,validateListing, wrapAsync(async(req , res) => {
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
app.delete("/listings/:id" , wrapAsync(async(req , res ) => {
    let { id } = req.params;
    let deletedListing =await Listing.findByIdAndDelete(id)
    res.redirect("/listings")

}));

//review route 
//post route
app.post("/listings/:id/reviews" ,validateReview , wrapAsync(async(req , res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    // console.log("new review saved");
    // res.send("new review saved");
    res.redirect(`/listings/${listing._id}`);

}));

//delete review
// Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
   //find by id and update is bcz we want to delete the listing from the array also
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    //this will dlete from page only
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));



//if called route deosnt exist
app.all("*" , (req , res , next) => {
    next(new ExpressError(404 , "Page Not Found!"));
});

///new middleware for error handeling
app.use((err , req , res , next)=>{
    // res.send("something went wrong!")
    let {statusCode =500 , message="something went wrong"} = err;
    // res.status(statusCode).send(message);
    //earlier it was only res.render thn added status to it
    // res.render("error.ejs" , { message });
    res.status(statusCode).render("error.ejs" , { message });
    
    
})





//serve ron
app.listen(8080 ,() => {
    console.log("server on");
});








// app.get("/testListing" , async(req,res) => {
//     let sampleListing = new Listing({
//         title: "my home",
//         description: "this is my new home",
//         //image
//         price: 1200,
//         location: "goa",
//         country: "india",
//     });
//     await sampleListing.save();
//     console.log("sample was saveed");
//     res.send("successfull");

// })