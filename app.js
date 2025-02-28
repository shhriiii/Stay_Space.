const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
//for put req
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema , reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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



//for server side validation of review

app.use("/listings" , listings);
app.use("/listings/:id/reviews", reviews);





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