const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  //yaaha pe map krnge jiise data mai ek ek object aaye aur usko insert krdega mtlb ek id se link krre joki dikhaega is owner ko belong krta hai
  initData.data = initData.data.map((obj) => ({...obj , owner : '67d560e8946006769483862b'}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();