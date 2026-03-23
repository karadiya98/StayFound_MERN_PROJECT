const mongoose = require("mongoose");
const sch = mongoose.Schema;


const userdata = new sch({
    Name: {
        type: String,
        required: [true, "Name is required"],
    },
   password: {
        type: Number,
        required: [true, "password is required"],
    },
   
    PhoneNumber: {
        type: Number,
        required: [true, "Ph is required"],
    },
     Address: {
        type: String,
        required: [true, "Address is required"],
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


const data = mongoose.model("userdata", userdata);
module.exports = data;