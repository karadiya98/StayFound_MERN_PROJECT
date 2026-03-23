const mongoose = require("mongoose");
const sch = mongoose.Schema;


const listingSchema = new sch({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
   image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" : v
        }
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    location: {
        type: String,
        required: [true, "Location is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;