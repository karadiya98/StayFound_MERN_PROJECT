const mongoose = require("mongoose");
const initData = require("./datas.js");
const Listing = require("../models/listing.js");

// 3. Database Connection
main()
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(err => console.log("DB Connection Error:", err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}



const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();