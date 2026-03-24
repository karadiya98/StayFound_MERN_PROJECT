const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const listing=require("./models/listing");
const userdata=require("./models/customer")
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const session = require('express-session');

// 1. Setup
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));

// 2. Middleware
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

// 3. Database Connection
main()
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(err => console.log("DB Connection Error:", err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
}

app.use(session({
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}));

app.use((req, res, next) => {
    res.locals.currUser = req.session.user || null; 
    next();
});

const isLoggedIn = (req, res, next) => {
    if (!req.session.user) {
        // Redirect to login if user is not in session
        res.send("cannot access directly the data !!")
    }
    next();
};

// -----------------------------------------------------------------------------------------------------

app.get("/listings/add",isLoggedIn,(req,res)=>
{
    res.render("user_listing.ejs")
})


app.post("/listings/add",isLoggedIn, upload.single("image"), async (req, res) => {
    try {
        let { title, description, price, location, country } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

        const newPlace = new listing({
            
            title,
            description,
            image: { 
                url: imageUrl, 
                filename: req.file ? req.file.originalname : "listingimage" 
            },
            price,
            location,
            country
        });
        await newPlace.save();
        res.redirect("/listings");

    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});


app.get("/",(req,res)=>
{
    res.render("home.ejs");
})

app.get("/listings", async (req, res) => {
    const allListings = await listing.find({}); 
    res.render("listings.ejs", { allListings });
});

app.get("/listings/:id",async (req,res)=>
{
    let {id}=req.params;
    const specificlistings = await listing.findById(id);; 
    res.render("specific.ejs", { specificlistings });
})

app.get("/signup",(req,res)=>
{
    res.render("signup.ejs")
})

app.post("/signup",async(req,res)=>
{
    let {Name,password,PhoneNumber,Address,location,country}=req.body;
    const user=new userdata(
        {
            Name, 
            password, 
            PhoneNumber, 
            Address, 
            location, 
            country
        }
    )

     const alreadyuseristhere = await userdata.findOne({ Name: Name, password: password });
        if (alreadyuseristhere) {
            console.log("user is already exists !!")
            res.render("/signup");
        } else {
            await user.save();
              req.session.user = user;// storing in sessin for verifying user is active or not 
            res.redirect("/")
        }
})


app.get("/login",(req,res)=>
{
    res.render("login.ejs")
})


app.post("/login", async (req, res) => {
    try {
        const { Name, password } = req.body;
        const user = await userdata.findOne({ Name: Name, password: password });

        if (user) {
            console.log("Login successful:", user);
            req.session.user = user;// storing in sessin for verifying user is active or not 
            res.redirect("/");
        } else {
            res.status(401).send("Invalid Name or Password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});





// ------------------------------------------- ADMIN_PANEL ----------------------------------------------------------
app.get("/admin",async (req,res)=>
{
    const allListings = await listing.find({}); 
    res.render("admin/admin.ejs", { allListings });
})

app.get("/admin/listings",async (req,res)=>
{
    const allListings = await listing.find({}); 
    res.render("admin/admin_listings.ejs", { allListings });
})

app.get("/admin/users", async (req,res)=>
{
   const allusers = await userdata.find({});
   const alllistings = await listing.find({ Name: "ADMIN" });
   const name = req.session.user?.Name;
   console.log(name); 

    res.render("admin/users.ejs",{allusers,alllistings});
})






//----------------------------------------------------------------------------------------------------------
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`✨ [StayFound] Live on port ${port}`);
});


app.use((req,res)=>
{
    res.send("!! NO page found !!")
})
