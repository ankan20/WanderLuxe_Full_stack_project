const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
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
  newListing.owner = req.user._id;
  await newListing.save();
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
  res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
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