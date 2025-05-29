

if(process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
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
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo"); //for storing session in mongo db
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust"
  const dbUrl = process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("cnntn succesfull");
})
.catch((err) => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);

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


  const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
  });
  
  store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE");
  });
  


  const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
//creating api
// app.get("/" , (req , res) => {
//     res.send("hi i am root!");
// });
  app.use(session(sessionOptions));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
  });

//   app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// });






//for server side validation of review

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/" , userRouter);

app.get("/", (req, res) => {
  res.redirect("/listings");
});





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
// app.listen(8080 ,() => {
//     console.log("server on");
// });
const port = process.env.PORT || 8080;
app.listen(port ,() => {
    console.log(`Server running on port ${port}`);
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