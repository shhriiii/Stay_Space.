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
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs" , { listing });
}));

//create route (add button)
app.post("/listings" , wrapAsync(async(req , res , next) => {
    //one way to extrct also rembr post ke sath body use hota aur get ke sath params
    //let {title , description , image , price , country , location} = req.body;
    //other way is go to neww.ejs aur title ko listing[title] krdo mtlb key value pair bana dema
    //js object bnjata hai
    //let listing = req.body.listing;
    if(!req.body.listing){
        throw new ExpressError(400 , "Invalid listing");
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
app.put("/listings/:id" , wrapAsync(async(req , res) => {
    if(!req.body.listing){
        throw new ExpressError(400 , "Invalid listing");
    }
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


//if called route deosnt exist
app.all("*" , (req , res , next) => {
    next(new ExpressError(404 , "Page Not Found!"));
});

///new middleware for error handeling
app.use((err , req , res , next)=>{
    // res.send("something went wrong!")
    let {statusCode =500 , message="something went wrong"} = err;
    res.status(statusCode).send(message);
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