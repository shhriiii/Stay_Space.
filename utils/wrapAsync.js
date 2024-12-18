module.exports = (fn) => {
    return (req , res , next) => {
        fn(req , res , next).catch(next);
    }
}

// older try catch block of create route
//create route (add button)
// app.post("/listings" , async(req , res , next) => {
//     //one way to extrct also rembr post ke sath body use hota aur get ke sath params
//     //let {title , description , image , price , country , location} = req.body;
//     //other way is go to neww.ejs aur title ko listing[title] krdo mtlb key value pair bana dema
//     //js object bnjata hai
//     //let listing = req.body.listing;
//     try{
//         const newListing = new Listing(req.body.listing);
//         await newListing.save();
//        res.redirect("/listings");
//     }
//     catch(err){
//         next(err);
//     }
    
// });