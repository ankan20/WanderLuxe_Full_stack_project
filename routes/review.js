const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn , isReviewAuthor, ifOwnerThenNotReview} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")

//Post review route
router.post(
  "/",
  isLoggedIn,
  ifOwnerThenNotReview,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Delete review route
router.delete(
  "/:reviewId",
  isLoggedIn,
  ifOwnerThenNotReview,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
