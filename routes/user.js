const express = require("express");
const router = express.Router();
const User =require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup" , (req,res) => {
    res.render("users/signup.ejs")
});
router.post("/signup", wrapAsync(async (req, res) => {
    try{
        let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser , (err) => {
    // ye line likhne se agar signup krnge toh direct login b hojyega directly
        if(err){
            return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
    });
    

    }
    catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup")
    }
    
}));

router.get("/login" , (req,res) => {
    res.render("users/login.ejs")
});

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async (req, res) => {
        req.flash("success", "Welcome to Wanderlust! You are logged in!");
        let redirectUrl = res.locals.redirectUrl || "/listings"; //yaha pr || isliye use kia if wrong id pass dalre the toh page not ound ara tha
res.redirect(res.locals.redirectUrl);

    }

);
//logout route
router.get("/logout" , (req, res, next) => {
    req.logout((err) => {
        if(err){
           return next(err);
        }
        req.flash("success" , "Goodbye!");
        res.redirect("/listings");
    })
});





module.exports = router;
