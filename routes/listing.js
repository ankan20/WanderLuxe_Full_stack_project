const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js")
const {isLoggedIn} = require("../middleware.js");
//middleware for listing validation server side
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((e) => e.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);
//Create Route
router.get("/new",isLoggedIn, (req, res) => {
  
  res.render("listings/new.ejs");
  
});

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
router.post(
  "/"
  ,isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    // const {title,description,price,country,location,image}=req.body;
    const listing = req.body.listing;

    let newListing = new Listing({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      image: listing.image,
      country: listing.country,
      location: listing.location,
    });
    await newListing.save();
    //console.log("saved")
    req.flash("success","New Listing Created");  
    res.redirect("/listings");
  })
);

//Update route
router.get(
  "/:id/edit",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

router.put(
  "/:id",isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, {
      $set: {
        title: listing.title,
        description: listing.description,
        price: listing.price,
        image: listing.image,
        country: listing.country,
        location: listing.location,
      },
    });
    req.flash("success","Listing Updated");
    
    res.redirect(`/listings/${id}`);
  })
);

//Delete route
router.delete(
  "/:id",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    //Deleting all reviews
    listing.reviews.map(
      wrapAsync(async (reviewId) => {
        await Review.findByIdAndDelete(reviewId);
      })
    );
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
  })
);

module.exports = router;
