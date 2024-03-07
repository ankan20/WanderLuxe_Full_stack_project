const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const wrapAsync = require("../utils/wrapAsync.js");
module.exports.index = async (req, res) => {
    let query = req.query.q;
    //console.log(query)
    let allListings = [];
    if(query === "trending"){
      allListings = await Listing.find({});
    }
    else if (query) {
      const validCategories = ["mountains", "arctic", "castles", "amazing pools", "farms", "camping", "rooms", "iconic cities", "domes", "boats"];
    
      allListings = await Listing.find({
        $or: [
          { title: { $regex: query, $options: 'i' } }, // Match title
          { location: { $regex: query, $options: 'i' } }, // Match location
          { country: { $regex: query, $options: 'i' } }, // Match country
          { category: { $in: validCategories, $regex: query, $options: 'i' } } // Match category with valid categories
        ]
      });
    }
    else {
      allListings = await Listing.find({});
    }
    console.log(allListings)
    res.render("listings/index.ejs", { allListings });
  }

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  }

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  }

module.exports.createListing = async (req, res, next) => {

  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
  })
    .send()

  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing( req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = {url,filename};
  newListing.geometry = response.body.features[0].geometry;
  let savedListing = await newListing.save();
  //console.log(savedListing)
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalUrl = listing.image.url;
  originalUrl = originalUrl.replace("/upload","/upload/w_250")
  res.render("listings/edit.ejs", { listing ,originalUrl});
}

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
  }
  
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  //Deleting all reviews
  listing.reviews.map(
    wrapAsync(async (reviewId) => {
      await Review.findByIdAndDelete(reviewId);
    })
  );
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
}